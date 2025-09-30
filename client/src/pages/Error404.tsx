
const Error404 = () => {
  return (
    <div className="flex-grow h-full w-full p-4">
        <div className="mx-auto w-full h-full max-w-6xl flex items-center justify-center gap-2 flex-col">
            <h1 className="font-doto text-4xl sm:text-5xl md:text-6xl text-center">Page not found!</h1>
            <img src="/ratelimit.webp" alt="404 not found" />
        </div>
    </div>
  )
}

export default Error404