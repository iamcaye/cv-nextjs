export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-[#e8e6e0] dark:border-[#1a1a1a]">
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="text-xs text-[#999] dark:text-[#444] font-mono">
                    Cayetano Biehler · {year}
                </span>
                <span className="text-xs text-[#ccc] dark:text-[#2a2a2a]">
                    i use nvim btw... 🤖
                </span>
            </div>
        </footer>
    )
}
