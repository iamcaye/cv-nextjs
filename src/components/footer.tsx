export default function Footer() {
    return (
        <footer className="py-5 my-10">
            <div className="block md:flex justify-center align-middle">
                <p className="text-tiny text-center break-normal md:w-4/12 w-full my-5 md:my-1.5">2025 Cayetano Biehler -- i use nvim btw</p>
                <div className="flex flex-row gap-3 md:justify-end md:w-8/12 min-w-max justify-center px-4">
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
