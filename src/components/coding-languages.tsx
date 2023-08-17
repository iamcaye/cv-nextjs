import { ICodingLanguage } from "@/models/CodingLanguage";

export default function CodingLanguage ({ languages }: { languages: ICodingLanguage[] }) {
    return (
        <div className="flex flex-row gap-3">
            {languages.map((language, index) => (
                <picture>
                    <img key={`${language}-${index}`} src={`https://img.icons8.com/color/48/${language}--v1.png`}
                        alt={language} width="30px" />
                </picture>
            ))}
        </div>
    );
}