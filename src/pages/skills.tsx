import CardComponent from "@/components/card-component";
import SkillCardComponent from "@/components/skill-card";
import Skill from "@/models/Skills";

export default function SkillsComponent() {
    const skills: Skill[] = [
        {
            name: "C#",
            comments: [
                "NET Core 6 for backend applications",
                "Data encryption",
                "Authentication and authorization",
            ],
            experience: "4 years",
            icon: "c-sharp-logo"
        },
        {
            name: "C",
            comments: [
                "Threads and multi-processing tasks",
                "Communication between processes",
            ],
            experience: "4 years",
            icon: "c"
        },
        {
            name: "Python",
            comments: [
                "Deep learning & Machine learning",
                "Web scraping & automation with Selenium",
                "Scripting"
            ],
            experience: "4 years",
            icon: "python"
        },
        {
            name: "Typescript",
            comments: [
                "React with Next",
                "Angular 14",
                "Express.ts"
            ],
            experience: "4 years",
            icon: "typescript"
        },
        {
            name: "MySQL",
            comments: [
                "Database design",
                "Query optimization",
            ],
            experience: "4 years",
            icon: "mysql"
        },
        {
            name: "Arduino",
            comments: [
                "Domotics",
                "Sensors utilization and data processing",
                "Bluetooth communication"
            ],
            experience: "4 years",
            icon: "arduino"
        },
        {
            name: "Micro-Controllers & FPGA",
            comments: [
                "Real-Time Operating Systems (FreeRTOS)",
                "Communication protocols (SPI, I2C, UART)",
                "Raspberry Pi, ESP32, ESP8266, MSP430, TM4C123G"
            ],
            experience: "4 years",
            icon: "raspberry-pi-zero"
        },
        {
            name: "Docker",
            comments: [
                "Dockerfile scripting",
                "Docker compose",
            ],
            experience: "4 years",
            icon: "docker"
        }
    ];

    return (
        <section className="mt-20">
            <header>
                <h1 className="text-center p-0 mb-5"> Skills </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {skills.map((skill: Skill, index:number) => (
                    <SkillCardComponent key={index} skill={skill} />
                ))}
            </div>
        </section>
    )
}