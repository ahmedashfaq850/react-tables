import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useTable, useSortBy  ,usePagination  } from 'react-table'


const tableColumns = [
    {Header: 'ID', accessor: 'id'},
    {Header: 'Title', accessor: 'title'},
    {Header: 'Price', accessor: 'price', Cell: ({ row }) => `$${row.values.price}`},
    {Header: 'Category', accessor: 'category'},
    {Header: 'Product Image', accessor: 'image', Cell: ({ row }) => <img src={row.values.image} height={100} alt=""/>},
    {Header: 'Product Description', accessor: 'description'},
    {Header: 'Action', Cell: ({ row }) => <button onClick={() => alert(`$ ${row.values.price}`)}>ClickHere</button>}
]



const EcommereceTable = () => {
    const [data, setData] = useState([])
    const [filtereData, setFiltereData] = useState([]);
    const [globalSearchText, setGlobalSearchText] = useState('')

    /* Fetch data from an API */
    const fetchData = async () => {
        const url = 'https://fakestoreapi.com/products'
        try {
            const response = await axios.get(url)
            setData(response.data)
        } catch (err) {
            console.log(err)
        }
    }
    
    /* Global Search Input Handle Function */
    const HandleSearchData = (e) => {
        const value = e.target.value || ''
        setGlobalSearchText(value)
    }
    
    /* Calling api first rendereing  */
    useEffect(() => {
        fetchData()
    }, [])

    /* Use useEffect for handling filtered data */
    useEffect(() => {
        const filteredData = data.filter((row) => {
          return Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(globalSearchText.toLowerCase())
          );
        });
        setFiltereData(filteredData);
      }, [data, globalSearchText]);

    /* useTable Hook and destructure useTable values */
    const { getTableProps, getTableBodyProps, page, prepareRow, headerGroups, state: { pageIndex }, pageCount, gotoPage, nextPage, previousPage, canNextPage, canPreviousPage} = useTable({data: filtereData, columns: tableColumns}, useSortBy, usePagination)

    return (
       <>
         <div>
            <h1>Ecommerce Data Table</h1>
            {/* Input For Global Search */}
            <input type='text'
                placeholder='Search Globally'
                value={globalSearchText}
                onChange={HandleSearchData}
            />
            {/* Table Section */}
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    {column.isSorted ? (column.isSortedDesc ? "⬇️" : "⬆️") : ""}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                    })}
                </tbody>
            </table>
        </div>
        {/* Buttons for pagination */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'}}>
                <button disabled={pageIndex === 0} onClick={() => gotoPage(0)}>&lt;&lt;</button>
                <button disabled={!canPreviousPage} onClick={previousPage}>&lt;</button>
                <p>{`${pageIndex + 1} of ${pageCount}`}</p>
                <button disabled={!canNextPage} onClick={nextPage}>&gt;</button>
                <button disabled={pageIndex >= pageCount - 1} onClick={() => gotoPage(pageCount - 1)}>&gt;&gt;</button>
            </div>
       </>
    )
}

export default EcommereceTable
