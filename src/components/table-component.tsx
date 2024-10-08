import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, CircularProgress } from "@nextui-org/react";
import { useMemo, useState } from "react";

export default function TableComponent({ rows, columns }: { rows: any[], columns: string[] }) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 4;

    const pages = Math.ceil(rows.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return rows.slice(start, end);
    }, [page, columns]);

    return (
        <div className="flex justify-center align-middle">
            {rows.length > 0 &&
                <Table
                    className="w-full"
                    aria-label="Example table with client side pagination"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                                color="warning"
                            />
                        </div>
                    }
                    classNames={{
                        wrapper: "min-h-[222px]",
                    }}
                >
                    <TableHeader>
                        {columns.map((columnKey) => (
                            <TableColumn key={columnKey}><p className="capitalize text-xl text-center">{columnKey}</p></TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody items={items}>
                        {(item) => (
                            <TableRow key={item.name}>
                                {(columnKey) =>
                                    <TableCell>
                                        {columnKey !== "name" && item[columnKey]}
                                        {columnKey === "name" && item[columnKey] && <a className="font-bold cursor-pointer" href={item.html_url} target="_blank" rel="noopener noreferrer">
                                            {item[columnKey]}</a>}
                                        {!item[columnKey] && ` -- No ${columnKey} --`}
                                    </TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            }
            {rows.length === 0 && <CircularProgress aria-label="Loading..." />}
        </div>
    );
}
