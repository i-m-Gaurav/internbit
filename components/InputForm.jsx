'use client'

import React from 'react'

import { useRouter } from 'next/navigation';

const InputForm = () => {

    const router = useRouter();

  return (
    <div>

<div className="flex flex-col items-center">
      <h1
        className="mb-4 mt-20 text-4xl font-extrabold leading-none tracking-tight text-gray-900"
      >
    <span className='text-white'>Video Call</span>
      </h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        const target = e.target;
        const channel = target.channel.value;
        router.push(`/channel/${channel}`);
      }}>
        <div className="md:flex md:items-center mt-6">
          <div>
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Channel Name
            </label>
          </div>
          <div>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="inline-full-name"
              type="text"
              name="channel"
              placeholder="Enter channel name"
              required
            />
          </div>
        </div>
        <div className="text-center">
          <button
            className="inline-flex items-center justify-center px-5 py-3 mt-5 text-base font-medium text-center text-white bg-blue-400 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >Submit</button
          >
        </div>
      </form>
    </div>



    </div>
  )
}

export default InputForm