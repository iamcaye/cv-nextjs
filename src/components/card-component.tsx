'use client'
import {Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { ICodingLanguage } from "@/models/CodingLanguage";
import CodingLanguage from "./coding-languages";

export default function CardComponent ({ title, children, languages } : {title:string, children:React.ReactNode, languages: ICodingLanguage[]}) {

    return (
        <Card className="py-4">
            <CardHeader className="pt-2 px-4 flex-col items-start pb-2">
                <p className="lg:text-medium text-tiny uppercase font-bold border-b-3 px-3 ">{title}</p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                {children}
            </CardBody>
            <CardFooter className="ml-3 flex flex-col lg:flex-row">
                <CodingLanguage languages={languages} />
                <a className="m-1 p-1 hover:border-2 rounded-md lg:self-end" href="">More info<i className="ml-2 bi bi-info-circle"></i></a>
            </CardFooter>
        </Card>
    );
}