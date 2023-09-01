import TableComponent from "@/components/table-component"
import { use, useEffect, useState } from "react"

export default function GitProjects () {
    const [repos, setRepos] = useState([])

    useEffect(() => {
        fetch("https://api.github.com/users/iamcaye/repos")
            .then(response => response.json())
            .then((data) => {
                setRepos(data.sort((a:any, b:any) => a.updated_at < b.updated_at ? 1 : -1));
                console.log(data)
            })
            .catch(error => console.log(error))
    }, [])

    return (
        <div className="mt-20 xs:hidden">
            <h1 className="text-center mb-5">Git Projects</h1>
            <TableComponent rows={repos} columns={["name", "description", "language"]} />
        </div>
    )
}