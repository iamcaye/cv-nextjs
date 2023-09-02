'use client'
import {Card, CardHeader, CardBody, CardFooter, useDisclosure, Button, Modal, ModalHeader, ModalBody, ModalContent } from "@nextui-org/react";
import { ICodingLanguage } from "@/models/CodingLanguage";
import CodingLanguage from "./coding-languages";

export default function CardComponent ( { title, children, languages, moreInfoComponent, shadow = "md" } :
    {   
        title:string,
        children?:React.ReactNode,
        languages?: ICodingLanguage[], 
        moreInfoComponent?: React.ReactNode,
        shadow?: "none" | "sm" | "md" | "lg";
    }) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <Card className="py-4" shadow={shadow} >
            <CardHeader className="pt-2 px-4 flex-col items-start pb-2">
                <p className="lg:text-medium text-tiny uppercase font-bold border-b-3 px-3 ">{title}</p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                {children}
            </CardBody>
            <CardFooter className="ml-3 flex flex-col lg:flex-row gap-2">
                { languages && <CodingLanguage languages={languages} /> }
                { moreInfoComponent && 
                    <>
                        <Button onPress={onOpen} className="m-1 p-2 hover:bg-slate-200 rounded-md lg:self-end">
                            More info<i className="bi bi-info-circle"></i>
                        </Button>
                        <Modal isOpen={isOpen} scrollBehavior="inside" size="3xl" onOpenChange={onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader>TOPdigital {title}</ModalHeader>
                                        <ModalBody>
                                            {moreInfoComponent}
                                        </ModalBody>
                                        <Button color="danger" variant="light" onClick={onClose}>
                                            Close
                                        </Button>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </>
                }
            </CardFooter>
        </Card>
    );
}