import Skill from "@/models/Skills";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function SkillCardComponent ( { skill }: { skill: Skill }) {
    return (
        <Card className="m-3 h-11/12">
            <CardHeader className="flex flex-row gap-2 p-0 py-1 px-5 justify-center align-middle border-b-2 self-center">
                <img key={`${skill.icon}`} src={`https://img.icons8.com/color/48/${skill.icon}${['raspberry-pi-zero', 'docker'].includes(skill.icon) ? '' : '--v1'}.png`}
                        alt={skill.name} width="30px" />
                <h3 className="text-md">{skill.name}</h3>
            </CardHeader>
            <CardBody className="p-10 md:p-5 h-full">
                <ul className="list-disc pl-3">
                {skill.comments && skill.comments.map((comment: string, index: number) => (
                    <li key={index}>{comment}.</li>
                ))}
                </ul>
            </CardBody>
        </Card>
    )
}