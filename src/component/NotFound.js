import React from 'react'

const NotFound = () => {
  return (
    <div className="font-KOTRAHOPE">
      <div className="flex justify-center items-start">
        <div className="bg-white rounded p-5 mt-10 text-center shadow-[0px_0px_40px_-10px_rgba(0,0,0,0.3)] h-auto md:w-[25rem] flex justify-center items-center">
          <div className="border-dashed rounded border-2 border-slate-500 p-10 my-5 md:w-[20rem] flex justify-center items-center">
            <div className="flex flex-col gap-4 font-bold text-slate-500">
              <p className="text-4xl">404 - Not Found</p>
              <p className='text-xl'>The requested page was not found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
