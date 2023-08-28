import { ICodingLanguage } from "./CodingLanguage";

export default interface Skill {
    name: string;
    experience: string;
    comments: string[];
    icon: ICodingLanguage;
}