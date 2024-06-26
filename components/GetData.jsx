'use client'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image'
import Lottie from 'react-lottie';
import animation1 from '../lotties/Animation1.json';
import { FaDownload } from "react-icons/fa6";
import { saveAs } from 'file-saver';

const GetData = () => {
  
  // lotties file

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };



  const ref = useRef();

  const [file, setFile] = useState();
  const [uploadedFile, setuploadedFile] = useState();
  const [result, setresult] = useState("");
  const [Uploadprogress, setUploadprogress] = useState(0);

  const getData = async () => {
    const data = new FormData();
    data.append('image', file);

    const options = {
      method: 'POST',
      url: 'https://product-background-removal.p.rapidapi.com/cutout/commodity/commodity',
      headers: {
        'X-RapidAPI-Key':'31fbc46ee9msh6a34913784143fap15a720jsnbb96d0876af0',
        'X-RapidAPI-Host': 'product-background-removal.p.rapidapi.com',
      },
      data: data,
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadprogress(percentCompleted);
      }
    //   onUploadProgress: This is an Axios specific configuration option.It allows you to specify a callback function that will be called whenever a chunk of data is uploaded.This function is triggered as the upload progresses.

    //     function(progressEvent) { ... }: This is an anonymous function that receives a progressEvent object as its parameter.This object contains information about the progress of the upload, such as loaded (the number of bytes that have been uploaded so far) and total(the total size of the file being uploaded).

    // const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);: This line calculates the percentage of the file that has been uploaded so far.It does so by dividing the number of bytes that have been uploaded(progressEvent.loaded) by the total size of the file(progressEvent.total), multiplying it by 100 to get a percentage, and rounding it to the nearest whole number using Math.round().
    };
  try {
    const response = await axios.request(options);
    // console.log(response.data.data.image_url);
    setresult(response.data.data.image_url)
    // console.log(file.name)
    setuploadedFile(URL.createObjectURL(file));

  } catch (error) {
    console.error(error);
  }


  ref.current?.scrollIntoView({ behavior: 'smooth' });
};

const handleChange = (e) => {
  setFile(e.target.files[0]);
};


const downloadImage = () => {
  saveAs(result, 'image.png')
}


return (
  <>
    <div className=' grid grid-cols-1 md:grid-cols-2 w-full mt-8'>

      <div>
        <Lottie
          options={defaultOptions}
          height={300}
          width={300}
        />
      </div>

      <div className='flex items-center flex-col my-auto mx-4 gap-4'>
        <input type="file" name="" id="" className='p-12 bg-white border-2 rounded-lg border-dashed text-gray-900 border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mx-3' onChange={handleChange} />
        <p className='text-xs text-red-500'>Image format: JPEG JPG BMP WEBP PNG(8-bit, 16-bit, 64-bit PNG not supported) <br />
          Image size: No more than 3 MB. <br />
          Image resolution: Less than 2000x2000px.</p>
        <p className='text-slate-600'>Upload Progress: {Uploadprogress}%</p>
        <button className='font-bold bg-gold rounded-md shadow-md px-3 py-2 hover:shadow-lg' onClick={getData}>Submit</button>
      </div>
    </div>


    {/* result */}
    <div className='flex flex-col md:flex-row items-center gap-8 px-4 mt-8 w-full justify-center' ref={ref} id=''>
      {uploadedFile &&
        <>
          <div className='border-dotted border-2 p-8'>
            <h3 className='text-center mb-4'>Uploaded image</h3>
            <Image src={uploadedFile} height={300} width={300} alt='uploaded image' />
          </div>
        </>
      }

      {result &&
        <>
          <div className='border-dotted border-2 p-8 box-border'>
            <h3 className='text-center mb-4'>After BG removal</h3>
            <Image src={result} height={300} width={300} alt='output image' />
            <button className='relative bottom-2 left-2' onClick={downloadImage}><FaDownload /></button>
          </div>
        </>
      }
    </div>
  </>
);
};

export default GetData