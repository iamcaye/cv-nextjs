import SkillCardComponent from "@/components/skill-card";
import Skill from "@/models/Skills";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';

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

            <div className="md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 hidden">
                {skills.map((skill: Skill, index:number) => (
                    <SkillCardComponent key={index} skill={skill} />
                ))}
            </div>
            <div className="md:hidden flex">
                <Swiper
                    style={{'color': '#fff'}}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    slidesPerView={1}
                    spaceBetween={10}
                    modules={[Navigation, Pagination, Scrollbar, A11y, Thumbs]}
                >
                {skills.map((skill:Skill, index:number) => (
                        <SwiperSlide key={index} className="my-4">
                            <SkillCardComponent skill={skill} />
                        </SwiperSlide>
                ))}
                </Swiper>
            </div>
        </section>
    )
}