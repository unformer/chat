import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import Peer from 'peerjs'

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '5000',
})

const SERVER_URL = 'http://localhost:5000'

export const useStream = (roomId) => {
    const [streamPeerId, setStreamPeerId] = useState()
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io(SERVER_URL, {
            query: { roomId }
        })

        peer.on('open', (id) => {
            console.log('peer open')
            setStreamPeerId(id)
        })

        // если пришёл peerId стримера
        socketRef.current.on('room-stream', peerId => {
            connectToNewUser(peerId)
        })

        function connectToNewUser(peerId) {
            console.log(peerId)

            // получаем медиаданные(видео и звук)
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                // звоним стримеру и передаём ему наш поток
                peer.call(peerId, stream)
                peer.on('call', function (call) {
                    console.log('stream')
                    // Ответ стримера
                    //call.answer(mediaStream)
                })
            })
        }

        return () => {
            socketRef.current.disconnect()
        }
    }, [roomId, streamPeerId])

    // запуск стрима по кнопке
    const startStopVideo = (videoStatus) => {

        const videoGrid = document.getElementById('video-grid')
        const myVideo = document.createElement('video')

        if (!videoStatus) {

            socketRef.current.emit('start-stream', roomId, streamPeerId)

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                myVideo.srcObject = stream
                myVideo.play()
                videoGrid.append(myVideo)
            })

            console.log('start')
        } else {
            myVideo.remove()
            videoGrid.innerHTML = ""
            console.log('stop')
        }

    }

    return { startStopVideo }

}