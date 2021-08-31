import {useState} from 'react'
import {Link} from 'react-router-dom'

const Lobby = ({rooms}) => {

    const [roomName, setRoomName] = useState('')
    const [dupNameErr, setDupNameErr] = useState('')

    const newRoom = (e) => {
        e.preventDefault()
        fetch(`/api/rooms/`, {
            method: "POST", 
            body: JSON.stringify({roomName}), 
            headers: {"Content-Type": "application/json"}
        }).then(res => {
            if (res.ok) {
                setRoomName('')
                setDupNameErr('')
            } else {
                setDupNameErr('that room already exists')
                return setTimeout(() => {
                    setDupNameErr('')
                }, 5000)
            }
        }).catch(err => console.log(err))
    }

    return (
        <div className="home-lobby-err-page">
            <h1>Join an existing study room or create your own!</h1>
            <form onSubmit={newRoom}>
                <input type='text' list="rooms" value={roomName} onChange={({target}) => setRoomName(target.value)} required></input>
                <button type='submit'>New Room </button>
            </form>
            <div>{dupNameErr}</div>
            <h3>Current rooms:</h3>
            {rooms.length > 0 && rooms.map(room => (
            <div><Link to={'/rooms/' + room}>{room}</Link></div>
            ))}
        </div>
     );
}
 
export default Lobby;