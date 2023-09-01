import CardComponent from "@/components/card-component";
import TDInfo from "./td-info";

export default function WorkExperience() {
  return (
        <section className="pt-10">
          <CardComponent title="Work Experience" languages={['python', 'typescript', 'nodejs', "c-sharp-logo", "angularjs"]} 
            moreInfoComponent={<TDInfo/>}>
            <div className="flex-col flex lg:flex-row items-center lg:items-top justify-between">
              <section className="ml-2">
                <p className="text-center md:text-left lg:text-left text-balanced">Working as a <b>Software Developer</b> at <a className="text-red-600 text-bold" rel="noopener" target="_blank" href="https://grupotopdigital.es/">Grupo Topdigital</a>.</p>
                <ul className="ml-5 list-disc">
                  <li>Frontend - Angular</li>
                  <li>Backend - NET Core 6, Express.ts</li>
                  <li>Automation Scripting & Web Scraping - Selenium, HTML Agility Pack</li>
                </ul>
              </section>
              <img className="md:w-6/12 pt-3 w-8/12 sm:w-6/12 lg:w-4/12 lg:pt-0 max-w-[400px]" src="https://grupotopdigital.es/wp-content/uploads/2021/07/logoH-2.png" alt="Grupo Topdgital" />
            </div>
          </CardComponent>
        </section>
  );
}