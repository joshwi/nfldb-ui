/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Input, Button } from 'reactstrap';
import { CSVLink } from 'react-csv';
import {
	useTable,
	usePagination,
	useSortBy,
	useFilters,
	useGroupBy,
	useExpanded,
	useRowSelect,
	useGlobalFilter,
	useBlockLayout,
	useResizeColumns,
} from 'react-table';
import "../static/css/main.css"

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
	const count = preFilteredRows.length;

	return (
		<input
			value={filterValue || ''}
			onChange={(e) => {
				setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
			}}
			placeholder={`Search ${count} records...`}
		/>
	);
}

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
	const count = preGlobalFilteredRows.length;

	return (
		<input
			value={globalFilter || ''}
			onChange={(e) => {
				setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
			}}
			placeholder={`Search ${count} accounts`}
			className="form-control"
			style={{
				height: '2rem',
				margin: '10px',
				width: '98%',
			}}
		/>
	);
}

function filterGreaterThan(rows, id, filterValue) {
	return rows.filter((row) => {
		const rowValue = row.values[id];
		return rowValue >= filterValue;
	});
}

filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

function App(props) {

	const [data, SetData] = useState([])
	const [columns, SetColumns] = useState([])

	const skipResetRef = React.useRef(false)

	useEffect(() => {
		if (props.headers && props.keys && props.headers.length === props.keys.length) {
			let input = props.keys.map((entry, index) => {
				return {
					Header: props.headers[index],
					accessor: entry,
					aggregate: entry,
					Aggregated: ({ value }) => `${value} Names`,
				}
			})
			SetColumns([{
				Header: ' ',
				columns: input
			}])
		}
	}, [props.headers, props.keys])

	const updateMyData = (rowIndex, columnId, value) => {
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

	React.useEffect(() => {
		SetData(props.data)
	}, [props.data])

	React.useEffect(() => {
		skipResetRef.current = false
	}, [data])

	const filterTypes = React.useMemo(
		() => ({
			text: (rows, id, filterValue) => {
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined
						? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
						: true;
				});
			},
		}),
		[]
	);

	const defaultColumn = React.useMemo(
		() => ({
			minWidth: 100,
			width: 165,
			maxWidth: 500,
			Filter: DefaultColumnFilter
		}),
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		preGlobalFilteredRows,
		setGlobalFilter,
		state: {
			pageIndex,
			pageSize,
			globalFilter
		},
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			filterTypes,
			updateMyData,
			// autoResetPage: !skipReset,
			// autoResetSelectedRows: !skipReset,
			disableMultiSort: true,
		},
		useFilters,
		useGlobalFilter,
		useGroupBy,
		useSortBy,
		useExpanded,
		usePagination,
		useRowSelect,
		useBlockLayout,
		useResizeColumns
	);

	// Render the UI for your table
	return (
		<Container fluid>
			<Row>
				<Col style={{ maxWidth: "99%", overflowX: "auto" }}>
					<table className="table table-dark table-striped" id="table" {...getTableProps()}>
						<thead>
							<tr>
								<th colSpan="100%" style={{ textAlign: 'center' }}>
									<GlobalFilter
										preGlobalFilteredRows={preGlobalFilteredRows}
										globalFilter={globalFilter}
										setGlobalFilter={setGlobalFilter}
									/>
								</th>
							</tr>
							<tr>
								{headerGroups.length > 1 && (
									<th className="th" {...headerGroups[1].getHeaderGroupProps()}>
										{headerGroups[1].headers.map((column) => (
											<div className="tr" {...column.getHeaderProps()}>
												<span {...column.getSortByToggleProps()}>
													{column.render('Header')}
													<div
														{...column.getResizerProps()}
														className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
													/>
													{/* Add a sort direction indicator */}
													{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
												</span>
												{/* Render the columns filter UI */}
												{/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
											</div>
										))}
									</th>
								)}
							</tr>
						</thead>
						<tbody {...getTableBodyProps()}>
							{page.map((row) => {
								prepareRow(row);
								return (
									<tr {...row.getRowProps()}>
										{row.cells.map((cell) => {
											return (
												<td className="td" id="shrink" {...cell.getCellProps()}>
													{cell.value}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</Col>
			</Row>
			<Row style={{ color: 'white', marginTop: '10px', height: '50px' }}>
				<Col xs={{ size: 1 }}/>
				<Col/>
				<Col xs={{ size: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ display: 'table', height: '50px' }}>
						<div style={{ color: 'white', display: 'table-cell', verticalAlign: 'middle', whiteSpace: "nowrap" }}>
							<div className="btn-group">
								<button
									className="btn btn-default"
									style={{ backgroundColor: 'black', color: 'white' }}
									onClick={() => gotoPage(0)}
									disabled={!canPreviousPage}
								>
									{'<<'}
								</button>
								<button
									className="btn btn-default"
									style={{ backgroundColor: 'black', color: 'white' }}
									onClick={() => previousPage()}
									disabled={!canPreviousPage}
								>
									{'<'}
								</button>
								<button
									className="btn btn-default"
									style={{ backgroundColor: 'black', color: 'white' }}
									onClick={() => nextPage()}
									disabled={!canNextPage}
								>
									{'>'}
								</button>
								<button
									className="btn btn-default"
									style={{ backgroundColor: 'black', color: 'white' }}
									onClick={() => gotoPage(pageCount - 1)}
									disabled={!canNextPage}
								>
									{'>>'}
								</button>
							</div>
						</div>
					</div>
				</Col>
				<Col xs={{ size: 2 }}style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ display: 'table', height: '50px' }}>
						<div style={{ color: 'white', display: 'table-cell', verticalAlign: 'middle' }}>
							<span style={{ display: 'inline-flex' }}>
								<span style={{ marginTop: '2px' }}>Page{'  '}</span>
								<Input
									placeholder={pageIndex + 1}
									min={1}
									max={pageOptions.length}
									type="number"
									step="1"
									style={{
										height: '2rem',
										width: '5rem',
										marginLeft: '10px',
										marginRight: '10px',
									}}
									onChange={(e) => {
										const page = e.target.value ? Number(e.target.value) - 1 : 0;
										gotoPage(page);
									}}
								/>
								<span style={{ marginTop: '2px' }}>
									{'  '}of {pageOptions.length}
								</span>
							</span>
						</div>
					</div>
				</Col>
				<Col xs={{ size: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ display: 'table', height: '50px' }}>
						<div style={{ color: 'white', display: 'table-cell', verticalAlign: 'middle' }}>
							<select
								value={pageSize}
								onChange={(e) => {
									setPageSize(Number(e.target.value));
								}}
								className="form-control"
								style={{
									width: '10rem',
								}}
							>
								{[10, 25, 50, 100].map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										{pageSize} items
									</option>
								))}
							</select>
						</div>
					</div>
				</Col>
				<Col xs={{ size: 2 }}>
					<div style={{ display: 'table', height: '50px' }}>
						<div style={{ color: 'white', display: 'table-cell', verticalAlign: 'middle' }}>
							<CSVLink filename={'nfldb.csv'} data={data}>
								<Button color="success">Export</Button>
							</CSVLink>
						</div>
					</div>
				</Col>
				<Col/>
				<Col xs={{ size: 1 }} />
			</Row>
		</Container>
	);
}

export default App;