import Skill from "@/models/Skills";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function SkillCardComponent ( { skill }: { skill: Skill }) {
    return (
        <Card className="py-4 w-full md:w-60 lg:w-80">
            <CardHeader className="flex flex-row gap-2 p-0 px-2 justify-center align-middle min-w-full">
                <img key={`${skill.icon}`} src={`https://img.icons8.com/color/48/${skill.icon}${['raspberry-pi-zero', 'docker'].includes(skill.icon) ? '' : '--v1'}.png`}
                        alt={skill.name} width="30px" />
                <p className="text-md">{skill.name}</p>
            </CardHeader>
            <CardBody className="p-10 md:p-5">
                <ul className="list-disc pl-3">
                {skill.comments && skill.comments.map((comment: string, index: number) => (
                    <li key={index}>{comment}.</li>
                ))}
                </ul>
            </CardBody>
        </Card>
    )
}