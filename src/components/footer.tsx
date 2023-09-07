export default function Footer() {
    return (
        <footer className="py-5 my-10">
        <div className="flex justify-center align-middle">
            <p className="text-tiny mt-1 break-normal w-4/12">© 2023 Cayetano Biehler</p>
            <div className="flex flex-row gap-3 justify-end w-8/12 px-4">
                <a className="flex gap-2" href="https://github.com/iamcaye" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-github"></i>
                    <p>Github</p>
                </a>
                <a className="flex gap-2 border-x-2 px-3" href="https://www.linkedin.com/in/cayetanobiehler/" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-linkedin"></i>
                    <p>LinkedIn</p>
                </a>
                <a className="flex gap-2 px-2" href="mailto:cayetano.biehler@gmail.com" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-envelope"></i>
                    <p>Gmail</p>
                </a>
            </div>
        </div>
        </footer>

    );
}