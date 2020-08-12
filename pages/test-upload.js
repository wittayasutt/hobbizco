import React, { useState } from 'react'
import { Container } from 'react-grid-system'
import axios from 'axios'
import ReactPlayer from 'react-player'

const TestUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const onChangeHandler = (event) => {
    setSelectedFile(event.target.files[0])
  }
  const onClickHandler = async () => {
    const data = new FormData()
    data.append('file', selectedFile)
    const uploadRes = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/file-upload/upload`,
      data,
    )
  }

  return (
    <Container>
      <input type="file" name="file" onChange={onChangeHandler} />
      <button
        type="button"
        className="btn btn-success btn-block"
        onClick={onClickHandler}
      >
        Upload
      </button>

      <video
        width="320"
        height="240"
        src="http://localhost:8000/1592322099591-video-proteacher2.mp4"
        // src="https://drive.google.com/file/d/1otE3nu4o28WigA95U_D_zWUMyiDziXGa/view"
        controls
        type="video/mp4"
        poster="image.png"
      />

      {/* <ReactPlayer
        url="http://localhost:8000/1591540729581-video-proteacher.mp4"
        playing
      /> */}
      {/* <video width="320" height="240" controls>
        <source
          src="http://localhost:8000/1591540729581-video-proteacher.mp4"
          type="video/mp4"
        />
        <source src="movie.ogg" type="video/ogg" />
        Your browser does not support the video tag.
      </video> */}
    </Container>
  )
}

export default TestUploadPage
