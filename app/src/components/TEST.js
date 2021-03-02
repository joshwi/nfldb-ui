/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from "reactstrap"
import { Select, Modal, Input } from "react-cui"
import styled from 'styled-components'
import {
    useTable,
    useFlexLayout,
    usePagination,
    useSortBy,
    useFilters,
    useGroupBy,
    useExpanded,
    useRowSelect,
    preGlobalFilteredRows,
    setGlobalFilter,
    useResizeColumns,
    useAsyncDebounce,
    useGlobalFilter
} from 'react-table'
import regeneratorRuntime from "regenerator-runtime";
import matchSorter from 'match-sorter'
import session_store from "../flux/stores/session_store";
import { update_page_session } from "../flux/actions/session_actions";
import { CSVLink } from "react-csv"
// import QUERY from "./QUERY"
import _ from "underscore"
 
// :nth-child(2n -1){
//     background-color: #f2f2f2;
// }
 
const Styles = styled.div`
  padding: 1rem;
 
  table {
    border-spacing: 0;
    border: 1px solid #dfdfdf;
    width: 100%;
    overflow-x: auto;
    tr {
        :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
 
    th,
    td {
      max-width: 200px;
      width: 40px;
      overflow: scroll;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #dfdfdf;
      border-right: 1px solid #dfdfdf;
      :last-child {
        border-right: 0;
      }
 
    }
  }
`
 
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)
 
    return (
        <div className="form-group input--icon base-margin-bottom">
            <div className="form-group__text">
                <input
                    label="Global Search"
                    value={value || ""}
                    onChange={e => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder={`Search ${count} items`}
                    style={{ fontWeight: "normal" }}
                />
                <button type="button" className="link">
                    <span className="icon-search"></span>
                </button>
 
            </div>
        </div>
    )
}
 
// Create an editable cell renderer
const EditableCell = ({
    value: initialValue,
    row: { index, original },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
    editable,
}) => {
    // We need to keep and update the state of the cell normally
    const [visible, SetVisible] = useState(false)
    const [action, SetAction] = useState("edit")
    const [query, SetQuery] = useState("CAPNET")
 
    const [value, setValue] = React.useState(original)
    const [data, SetData] = useState(original)
 
    const onChange = e => {
        setValue(e.target.value)
    }
 
    React.useEffect(() => { console.log(value) }, [value])
 
    // useEffect(() => { console.log(data) }, [data])
 
    return (
        <>
            <button onClick={() => { SetVisible(!visible) }} style={{ backgroundColor: "transparent", border: 0 }}>{value}</button>
            {visible == true && (
                <Modal
                    size={action === "edit" ? "medium" : "small"}
                    onClose={() => SetVisible(false)}
                    visible={visible}
                >
                    <Modal.Body>
                        {Object.keys(original).length > 0 && <h4 style={{ margin: "15px" }} className='modal__title'>{original[Object.keys(original)[0]]}</h4>}
                        <ul style={{ marginBottom: "20px" }} id="bordered" class="tabs tabs--bordered">
                            <li id="bordered-1" className={`tab ${action === "edit" ? "active" : ""}`}>
                                <a onClick={() => SetAction("edit")} tabindex="0">Edit Info</a>
                            </li>
                            <li id="bordered-2" className={`tab ${action === "query" ? "active" : ""}`}>
                                <a onClick={() => SetAction("query")} tabindex="1">Query Info</a>
                            </li>
                        </ul>
                        {action == "edit" && (
                            <>
                                {Object.keys(original).map((entry, index) => {
                                    return (
                                        <Input
                                            type='text'
                                            label={entry}
                                            value={original.entry}
                                            placeholder={original[entry]}
                                            onChange={(val) => SetData({ ...data, [entry]: val })}
                                        />
                                    )
                                })}
                                <button
                                    style={{ margin: "15px" }}
                                    className='btn btn--small btn--tertiary active'
                                    onClick={() => SetVisible(false)}
                                >Save</button>
                            </>
                        )}
                        {action == "query" && (
                            <div><Select
                                style={{ marginTop: "20px" }}
                                state="focus"
                                options={[
                                    'CAPNET',
                                    'ISP',
                                    'IXP',
                                    'ITaaC'
                                ]}
                                label='Select Type of Circuit'
                                value={query}
                                onChange={val => SetQuery(val)}
                            />
                                <button
                                    style={{ margin: "15px" }}
                                    className='btn btn--small btn--tertiary active'
                                    onClick={() => SetVisible(false)}
                                >Submit</button>
                            </div>
                        )}
 
                    </Modal.Body>
                </Modal>
            )}
        </>)
}
 
// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
    state: { filters }
 
}) {
    const count = preFilteredRows.length
 
    // useEffect(() => { console.log(filters) }, [filters])
 
    return (
        <input
            style={{ borderColor: "#dfdfdf", borderWidth: "1px", borderStyle: "solid", backgroundColor: "white", textAlign: "center", width: "98%", fontSize: "98%", height: "30px", fontWeight: "normal" }}
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`${count} items`}
        />
    )
}
 
function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
 
// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val
 
// Be sure to pass our updateMyData and the skipReset option
function Table({ columns, data, updateMyData, skipReset, info, source }) {
 
    // console.log(source, info)
 
    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )
 
    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
            // And also our default editable cell
            Cell: EditableCell,
        }),
        []
    )
 
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page
 
        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        state,
        previousPage,
        setPageSize,
        setAllFilters,
        preGlobalFilteredRows,
        setGlobalFilter,
        visibleColumns,
        state: {
            pageIndex,
            pageSize,
            sortBy,
            groupBy,
            expanded,
            filters,
            selectedRowIds,
        },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            updateMyData,
            // We also need to pass this so the page doesn't change
            // when we edit the data.
            autoResetPage: !skipReset,
            autoResetSelectedRows: !skipReset,
            disableMultiSort: true,
        },
        useFilters,
        useGlobalFilter,
        useGroupBy,
        useSortBy,
        useExpanded,
        usePagination,
        // useFlexLayout,
        useRowSelect,
        // Here we will use a plugin to add our selection column
        useResizeColumns
    )
 
    useEffect(() => { setPageSize(50) }, [])
 
    const [active, SetActive] = useState(["label"])
 
    useEffect(() => {
        if (columns.length >= 0) {
            let active_fields = columns[0].columns.map((entry, index) => {
                return entry.Header
            })
            SetActive(active_fields)
        }
    }, [columns])
 
 
    function export_filtered_results() {
        let output = rows.map(index => {
            let item = _.pick(index.original, active)
            return item
        })
        return output
    }
 
    const [edit, SetEdit] = useState(false)
    const [currentRow, SetCurrentRow] = useState({})
 
    useEffect(() => {
        let session = session_store.getPageSession(window.location.href)
        if (session.state !== undefined && session.state.length > 0) {
            setAllFilters(session.state)
        }
    }, [columns])
 
    useEffect(() => {
        update_page_session(window.location.href, "state", state.filters)
    }, [state.filters])
 
    // useEffect(() => {
    //     console.log(state.filters)
    // }, [state.filters])
 
    // useEffect(() => { console.log(currentRow) }, [currentRow])
 
    // Render the UI for your table
    return (
        <Container style={{ width: "87vw", maxWidth: "87vw", paddingTop: "20px", textAlign: "left" }}>
            <Row style={{ width: "inherit" }}>
                <Col style={{ width: "inherit", overflowX: "auto" }}>
                    <table className="table table--striped" {...getTableProps()}>
                        <thead>
                            <>
                                <tr>
                                    <th colSpan="100%" style={{ paddingBottom: "0px" }}>
                                        <GlobalFilter
                                            preGlobalFilteredRows={preGlobalFilteredRows}
                                            globalFilter={state.globalFilter}
                                            setGlobalFilter={setGlobalFilter}
                                        /></th>
                                </tr>
                                {headerGroups.length > 1 &&
                                    <tr {...headerGroups[1].getHeaderGroupProps()}>
                                        {headerGroups[1].headers.map(column => {
                                            return <th {...column.getHeaderProps()} style={{ fontSize: "11px" }}>
                                                <span {...column.getSortByToggleProps()}>
                                                    {column.render('Header')}
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? <><span> </span><span className="icon-chevron-down"></span></>
                                                            : <><span> </span><span className="icon-chevron-up"></span></>
                                                        : ''}
                                                </span>
                                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                                            </th>
                                        })}
                                    </tr>
                                }
                            </>
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            if (cell.column.Header === "STATUS") {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px", backgroundColor: `${cell.value === "Up" ? "green" : "red"}`, color: `white` }}>
                                                        {cell.value}
                                                    </td>
                                                )
                                            }
                                            else if (cell.column.Header === "CIR" || cell.column.Header === "BURST" || cell.column.Header.indexOf("LOAD") > -1) {
                                                return (
                                                    <td style={{ fontSize: "11px" }}>
                                                        {`${cell.value >= 1000 ? `${(cell.value / 1000).toFixed(1)} Gbps` : `${cell.value} Mbps`}`}
                                                    </td>
                                                )
                                            }
                                            else if (cell.column.Header.indexOf("CIR %") > -1) {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px", backgroundColor: `${cell.value < 100 ? "green" : "orange"}`, color: `white` }}>
                                                        {`${cell.value} %`}
                                                    </td>
                                                )
                                            }
                                            else if (cell.column.Header.indexOf("BURST %") > -1) {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px", backgroundColor: `${cell.value < 100 ? "green" : "red"}`, color: `white` }}>
                                                        {`${cell.value} %`}
                                                    </td>
                                                )
                                            }
                                            else if (cell.column.Header.indexOf("ASN") > -1) {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px" }}>
                                                        <a href={`https://www.peeringdb.com/search?q=${cell.value}`}>{cell.value}</a>
                                                    </td>
                                                )
                                            }
                                            else {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px" }}>
                                                        {cell.value}
                                                    </td>
                                                )
                                            }
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <Row style={{ height: "75px", margin: "20px" }}>
                {/* <Col></Col> */}
                {/* <Col xs={{ size: 3 }} style={{ height: "inherit" }}> */}
                <Col style={{ height: "inherit" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <ul className="pagination">
                            <li><a href="javascript:;" onClick={() => previousPage()} disabled={!canPreviousPage}><span className="icon-arrow-left-tail"></span></a></li>
                            {pageIndex >= 1 && (<li><a href="javascript:;" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>1</a></li>)}
                            {pageCount > 3 && pageIndex > 1 && (<li><span className="icon-more"></span></li>)}
                            {pageIndex > 1 && pageOptions.length > 2 && (<li><a href="javascript:;" onClick={() => gotoPage(pageIndex - 1)} disabled={!canPreviousPage}>{pageIndex}</a></li>)}
                            <li className="active"><a href="javascript:;" disabled={!canPreviousPage}>{pageIndex + 1}</a></li>
                            {pageIndex + 2 < pageOptions.length && pageOptions.length > 2 && (<li><a href="javascript:;" onClick={() => gotoPage(pageIndex + 1)} disabled={!canNextPage}>{pageIndex + 2}</a></li>)}
                            {pageCount > 3 && pageIndex < pageCount - 1 && (<li><span className="icon-more"></span></li>)}
                            {pageIndex < pageCount - 1 && (<li><a href="javascript:;" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{pageCount}</a></li>)}
                            <li><a href="javascript:;" onClick={() => nextPage()} disabled={!canNextPage}><span className="icon-arrow-right-tail"></span></a></li>
                        </ul>
                    </div>
                </Col>
                {/* <Col xs={{ size: 2 }} style={{ height: "inherit" }}> */}
                <Col style={{ height: "inherit" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <span>Page{' '}</span>
                        <span>
                            <div style={{ marginRight: "10px", marginLeft: "10px", marginTop: "25%" }} className="form-group base-margin-bottom">
                                <div className="form-group__text">
                                    <input id="input-type-number" type="number" type="number"
                                        value={pageIndex + 1}
                                        min={0}
                                        max={pageOptions.length}
                                        onChange={e => {
                                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                                            gotoPage(page)
                                        }}
                                        style={{ width: '60px' }} />
                                </div>
                            </div>
                        </span>
                        <span> of {pageOptions.length}</span>
                    </div>
                </Col>
                {/* <Col xs={{ size: 2 }} style={{ height: "inherit" }}> */}
                {/* <Col style={{ height: "inherit" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <span style={{ marginRight: "10px" }}>Page Size</span>
                        <span style={{ marginLeft: "10px", width: "100px" }}>
                            <Select
                                options={["10", "25", "50", "100"]}
                                value={pageSize}
                                onChange={val => setPageSize(val)}
                            />
                        </span>
                    </div>
                </Col> */}
                {/* <Col xs={{ size: 2 }} style={{ textAlign: "center", height: "inherit" }}> */}
                {/*<Col style={{ height: "inherit" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <CSVLink filename={"NSSOT_DATA.csv"} data={export_filtered_results()}><button style={{ color: "white", backgroundColor: "#005073" }} className="btn btn--small btn--secondary">Export</button></CSVLink>
                    </div>
            </Col>*/}
                {/* <Col></Col> */}
            </Row>
        </Container>
    )
}
 
// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
    return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue >= filterValue
    })
}
 
filterGreaterThan.autoRemove = val => typeof val !== 'number'
 
function App(props) {
    const [info, SetInfo] = useState(props.info)
    const [source, SetSource] = useState(props.source)
    // console.log('props.headers:', props.headers)
    const [data, SetData] = useState([])
    const [originalData] = React.useState(data)
    const [visible, SetVisible] = useState(false)
 
    useEffect(() => { SetInfo(props.info) }, [props.info])
    useEffect(() => { SetSource(props.source) }, [props.source])
 
    function build_columns(columns) {
        let output = []
        // console.log('COLUMNS:', columns)
        for (var n in columns) {
            // console.log(props.titles[n], columns[n])
            output.push({
                Header: props.titles[n],
                accessor: columns[n],
                aggregate: columns[n],
                Aggregated: ({ value }) => `${value} Names`,
            })
        }
        return output
    }
 
    const columns = React.useMemo(
        () => [
            {
                Header: ' ',
                columns: build_columns(props.headers)
            },]
    )
 
    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.
    const skipResetRef = React.useRef(false)
 
    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        skipResetRef.current = true
        SetData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...row,
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }
 
    // After data changes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    React.useEffect(() => {
        // console.log("reset")
        skipResetRef.current = false
        // console.log("UPDATED", data)
    }, [data])
 
    React.useEffect(() => {
        SetData(props.rows)
    }, [props.rows])
 
    // Let's add a data resetter/randomizer to help
    // illustrate that flow...
    const resetData = () => {
        // Don't reset the page when we do this
        skipResetRef.current = true
        SetData(originalData)
    }
 
    return (
 
        <>
            <Styles>
                <Table
                    columns={columns}
                    data={data}
                    updateMyData={updateMyData}
                    info={info}
                    source={source}
                // skipReset={skipResetRef.current}
                />
            </Styles>
 
        </>
 
    )
}
 

    export default App

RAW Paste Data
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from "reactstrap"
import { Select, Modal, Input } from "react-cui"
import styled from 'styled-components'
import {
    useTable,
    useFlexLayout,
    usePagination,
    useSortBy,
    useFilters,
    useGroupBy,
    useExpanded,
    useRowSelect,
    preGlobalFilteredRows,
    setGlobalFilter,
    useResizeColumns,
    useAsyncDebounce,
    useGlobalFilter
} from 'react-table'
import regeneratorRuntime from "regenerator-runtime";
import matchSorter from 'match-sorter'
import session_store from "../flux/stores/session_store";
import { update_page_session } from "../flux/actions/session_actions";
import { CSVLink } from "react-csv"
// import QUERY from "./QUERY"
import _ from "underscore"

// :nth-child(2n -1){
//     background-color: #f2f2f2;
// }

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid #dfdfdf;
    width: 100%;
    overflow-x: auto;
    tr {
        :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      max-width: 200px;
      width: 40px;
      overflow: scroll;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #dfdfdf;
      border-right: 1px solid #dfdfdf;
      :last-child {
        border-right: 0;
      }

    }
  }
`

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <div className="form-group input--icon base-margin-bottom">
            <div className="form-group__text">
                <input
                    label="Global Search"
                    value={value || ""}
                    onChange={e => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder={`Search ${count} items`}
                    style={{ fontWeight: "normal" }}
                />
                <button type="button" className="link">
                    <span className="icon-search"></span>
                </button>

            </div>
        </div>
    )
}

// Create an editable cell renderer
const EditableCell = ({
    value: initialValue,
    row: { index, original },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
    editable,
}) => {
    // We need to keep and update the state of the cell normally
    const [visible, SetVisible] = useState(false)
    const [action, SetAction] = useState("edit")
    const [query, SetQuery] = useState("CAPNET")

    const [value, setValue] = React.useState(original)
    const [data, SetData] = useState(original)

    const onChange = e => {
        setValue(e.target.value)
    }

    React.useEffect(() => { console.log(value) }, [value])

    // useEffect(() => { console.log(data) }, [data])

    return (
        <>
            <button onClick={() => { SetVisible(!visible) }} style={{ backgroundColor: "transparent", border: 0 }}>{value}</button>
            {visible == true && (
                <Modal
                    size={action === "edit" ? "medium" : "small"}
                    onClose={() => SetVisible(false)}
                    visible={visible}
                >
                    <Modal.Body>
                        {Object.keys(original).length > 0 && <h4 style={{ margin: "15px" }} className='modal__title'>{original[Object.keys(original)[0]]}</h4>}
                        <ul style={{ marginBottom: "20px" }} id="bordered" class="tabs tabs--bordered">
                            <li id="bordered-1" className={`tab ${action === "edit" ? "active" : ""}`}>
                                <a onClick={() => SetAction("edit")} tabindex="0">Edit Info</a>
                            </li>
                            <li id="bordered-2" className={`tab ${action === "query" ? "active" : ""}`}>
                                <a onClick={() => SetAction("query")} tabindex="1">Query Info</a>
                            </li>
                        </ul>
                        {action == "edit" && (
                            <>
                                {Object.keys(original).map((entry, index) => {
                                    return (
                                        <Input
                                            type='text'
                                            label={entry}
                                            value={original.entry}
                                            placeholder={original[entry]}
                                            onChange={(val) => SetData({ ...data, [entry]: val })}
                                        />
                                    )
                                })}
                                <button
                                    style={{ margin: "15px" }}
                                    className='btn btn--small btn--tertiary active'
                                    onClick={() => SetVisible(false)}
                                >Save</button>
                            </>
                        )}
                        {action == "query" && (
                            <div><Select
                                style={{ marginTop: "20px" }}
                                state="focus"
                                options={[
                                    'CAPNET',
                                    'ISP',
                                    'IXP',
                                    'ITaaC'
                                ]}
                                label='Select Type of Circuit'
                                value={query}
                                onChange={val => SetQuery(val)}
                            />
                                <button
                                    style={{ margin: "15px" }}
                                    className='btn btn--small btn--tertiary active'
                                    onClick={() => SetVisible(false)}
                                >Submit</button>
                            </div>
                        )}

                    </Modal.Body>
                </Modal>
            )}
        </>)
}

// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
    state: { filters }

}) {
    const count = preFilteredRows.length

    // useEffect(() => { console.log(filters) }, [filters])

    return (
        <input
            style={{ borderColor: "#dfdfdf", borderWidth: "1px", borderStyle: "solid", backgroundColor: "white", textAlign: "center", width: "98%", fontSize: "98%", height: "30px", fontWeight: "normal" }}
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`${count} items`}
        />
    )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Be sure to pass our updateMyData and the skipReset option
function Table({ columns, data, updateMyData, skipReset, info, source }) {

    // console.log(source, info)

    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            fuzzyText: fuzzyTextFilterFn,
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
            // And also our default editable cell
            Cell: EditableCell,
        }),
        []
    )

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        state,
        previousPage,
        setPageSize,
        setAllFilters,
        preGlobalFilteredRows,
        setGlobalFilter,
        visibleColumns,
        state: {
            pageIndex,
            pageSize,
            sortBy,
            groupBy,
            expanded,
            filters,
            selectedRowIds,
        },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            updateMyData,
            // We also need to pass this so the page doesn't change
            // when we edit the data.
            autoResetPage: !skipReset,
            autoResetSelectedRows: !skipReset,
            disableMultiSort: true,
        },
        useFilters,
        useGlobalFilter,
        useGroupBy,
        useSortBy,
        useExpanded,
        usePagination,
        // useFlexLayout,
        useRowSelect,
        // Here we will use a plugin to add our selection column
        useResizeColumns
    )

    useEffect(() => { setPageSize(50) }, [])

    const [active, SetActive] = useState(["label"])

    useEffect(() => {
        if (columns.length >= 0) {
            let active_fields = columns[0].columns.map((entry, index) => {
                return entry.Header
            })
            SetActive(active_fields)
        }
    }, [columns])


    function export_filtered_results() {
        let output = rows.map(index => {
            let item = _.pick(index.original, active)
            return item
        })
        return output
    }

    const [edit, SetEdit] = useState(false)
    const [currentRow, SetCurrentRow] = useState({})

    useEffect(() => {
        let session = session_store.getPageSession(window.location.href)
        if (session.state !== undefined && session.state.length > 0) {
            setAllFilters(session.state)
        }
    }, [columns])

    useEffect(() => {
        update_page_session(window.location.href, "state", state.filters)
    }, [state.filters])

    // useEffect(() => {
    //     console.log(state.filters)
    // }, [state.filters])

    // useEffect(() => { console.log(currentRow) }, [currentRow])

    // Render the UI for your table
    return (
        <Container style={{ width: "87vw", maxWidth: "87vw", paddingTop: "20px", textAlign: "left" }}>
            <Row style={{ width: "inherit" }}>
                <Col style={{ width: "inherit", overflowX: "auto" }}>
                    <table className="table table--striped" {...getTableProps()}>
                        <thead>
                            <>
                                <tr>
                                    <th colSpan="100%" style={{ paddingBottom: "0px" }}>
                                        <GlobalFilter
                                            preGlobalFilteredRows={preGlobalFilteredRows}
                                            globalFilter={state.globalFilter}
                                            setGlobalFilter={setGlobalFilter}
                                        /></th>
                                </tr>
                                {headerGroups.length > 1 &&
                                    <tr {...headerGroups[1].getHeaderGroupProps()}>
                                        {headerGroups[1].headers.map(column => {
                                            return <th {...column.getHeaderProps()} style={{ fontSize: "11px" }}>
                                                <span {...column.getSortByToggleProps()}>
                                                    {column.render('Header')}
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? <><span> </span><span className="icon-chevron-down"></span></>
                                                            : <><span> </span><span className="icon-chevron-up"></span></>
                                                        : ''}
                                                </span>
                                                <div>{column.canFilter ? column.render('Filter') : null}</div>
                                            </th>
                                        })}
                                    </tr>
                                }
                            </>
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            if (cell.column.Header === "STATUS") {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px", backgroundColor: `${cell.value === "Up" ? "green" : "red"}`, color: `white` }}>
                                                        {cell.value}
                                                    </td>
                                                )
                                            }
                                            else if (cell.column.Header === "CIR" || cell.column.Header === "BURST" || cell.column.Header.indexOf("LOAD") > -1) {
                                                return (
                                                    <td style={{ fontSize: "11px" }}>
                                                        {`${cell.value >= 1000 ? `${(cell.value / 1000).toFixed(1)} Gbps` : `${cell.value} Mbps`}`}
                                                    </td>
                                                )
                                            }
                                            else if (cell.column.Header.indexOf("CIR %") > -1) {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px", backgroundColor: `${cell.value < 100 ? "green" : "orange"}`, color: `white` }}>
                                                        {`${cell.value} %`}
                                                    </td>
                                                )
                                            }
                                            else if (cell.column.Header.indexOf("BURST %") > -1) {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px", backgroundColor: `${cell.value < 100 ? "green" : "red"}`, color: `white` }}>
                                                        {`${cell.value} %`}
                                                    </td>
                                                )
                                            }
                                            else if (cell.column.Header.indexOf("ASN") > -1) {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px" }}>
                                                        <a href={`https://www.peeringdb.com/search?q=${cell.value}`}>{cell.value}</a>
                                                    </td>
                                                )
                                            }
                                            else {
                                                return (
                                                    <td {...cell.getCellProps()} style={{ fontSize: "11px" }}>
                                                        {cell.value}
                                                    </td>
                                                )
                                            }
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <Row style={{ height: "75px", margin: "20px" }}>
                {/* <Col></Col> */}
                {/* <Col xs={{ size: 3 }} style={{ height: "inherit" }}> */}
                <Col style={{ height: "inherit" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <ul className="pagination">
                            <li><a href="javascript:;" onClick={() => previousPage()} disabled={!canPreviousPage}><span className="icon-arrow-left-tail"></span></a></li>
                            {pageIndex >= 1 && (<li><a href="javascript:;" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>1</a></li>)}
                            {pageCount > 3 && pageIndex > 1 && (<li><span className="icon-more"></span></li>)}
                            {pageIndex > 1 && pageOptions.length > 2 && (<li><a href="javascript:;" onClick={() => gotoPage(pageIndex - 1)} disabled={!canPreviousPage}>{pageIndex}</a></li>)}
                            <li className="active"><a href="javascript:;" disabled={!canPreviousPage}>{pageIndex + 1}</a></li>
                            {pageIndex + 2 < pageOptions.length && pageOptions.length > 2 && (<li><a href="javascript:;" onClick={() => gotoPage(pageIndex + 1)} disabled={!canNextPage}>{pageIndex + 2}</a></li>)}
                            {pageCount > 3 && pageIndex < pageCount - 1 && (<li><span className="icon-more"></span></li>)}
                            {pageIndex < pageCount - 1 && (<li><a href="javascript:;" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{pageCount}</a></li>)}
                            <li><a href="javascript:;" onClick={() => nextPage()} disabled={!canNextPage}><span className="icon-arrow-right-tail"></span></a></li>
                        </ul>
                    </div>
                </Col>
                {/* <Col xs={{ size: 2 }} style={{ height: "inherit" }}> */}
                <Col style={{ height: "inherit" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <span>Page{' '}</span>
                        <span>
                            <div style={{ marginRight: "10px", marginLeft: "10px", marginTop: "25%" }} className="form-group base-margin-bottom">
                                <div className="form-group__text">
                                    <input id="input-type-number" type="number" type="number"
                                        value={pageIndex + 1}
                                        min={0}
                                        max={pageOptions.length}
                                        onChange={e => {
                                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                                            gotoPage(page)
                                        }}
                                        style={{ width: '60px' }} />
                                </div>
                            </div>
                        </span>
                        <span> of {pageOptions.length}</span>
                    </div>
                </Col>
                {/* <Col xs={{ size: 2 }} style={{ height: "inherit" }}> */}
                {/* <Col style={{ height: "inherit" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <span style={{ marginRight: "10px" }}>Page Size</span>
                        <span style={{ marginLeft: "10px", width: "100px" }}>
                            <Select
                                options={["10", "25", "50", "100"]}
                                value={pageSize}
                                onChange={val => setPageSize(val)}
                            />
                        </span>
                    </div>
                </Col> */}
                {/* <Col xs={{ size: 2 }} style={{ textAlign: "center", height: "inherit" }}> */}
                {/*<Col style={{ height: "inherit" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "inherit" }}>
                        <CSVLink filename={"NSSOT_DATA.csv"} data={export_filtered_results()}><button style={{ color: "white", backgroundColor: "#005073" }} className="btn btn--small btn--secondary">Export</button></CSVLink>
                    </div>
            </Col>*/}
                {/* <Col></Col> */}
            </Row>
        </Container>
    )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
    return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue >= filterValue
    })
}

filterGreaterThan.autoRemove = val => typeof val !== 'number'

function App(props) {
    const [info, SetInfo] = useState(props.info)
    const [source, SetSource] = useState(props.source)
    // console.log('props.headers:', props.headers)
    const [data, SetData] = useState([])
    const [originalData] = React.useState(data)
    const [visible, SetVisible] = useState(false)

    useEffect(() => { SetInfo(props.info) }, [props.info])
    useEffect(() => { SetSource(props.source) }, [props.source])

    function build_columns(columns) {
        let output = []
        // console.log('COLUMNS:', columns)
        for (var n in columns) {
            // console.log(props.titles[n], columns[n])
            output.push({
                Header: props.titles[n],
                accessor: columns[n],
                aggregate: columns[n],
                Aggregated: ({ value }) => `${value} Names`,
            })
        }
        return output
    }

    const columns = React.useMemo(
        () => [
            {
                Header: ' ',
                columns: build_columns(props.headers)
            },]
    )

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.
    const skipResetRef = React.useRef(false)

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        skipResetRef.current = true
        SetData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...row,
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

    // After data changes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    React.useEffect(() => {
        // console.log("reset")
        skipResetRef.current = false
        // console.log("UPDATED", data)
    }, [data])

    React.useEffect(() => {
        SetData(props.rows)
    }, [props.rows])

    // Let's add a data resetter/randomizer to help
    // illustrate that flow...
    const resetData = () => {
        // Don't reset the page when we do this
        skipResetRef.current = true
        SetData(originalData)
    }

    return (

        <>
            <Styles>
                <Table
                    columns={columns}
                    data={data}
                    updateMyData={updateMyData}
                    info={info}
                    source={source}
                // skipReset={skipResetRef.current}
                />
            </Styles>

        </>

    )
}

export default App