import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreatePolls.css";
import { MyContext } from "../provider/MyProvider";

export default function CreatePolls() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [visibility, setVisibility] = useState("public");
    const [message, setMessage] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useContext(MyContext);

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login", { state: { from: location.pathname } });
        }
    }, [isLoggedIn, navigate, location]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);

    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    async function handleSubmit() {
        if (!question) {
            setMessage("Poll question is required.");
            return;
        }

        const emptyOptionIndex = options.findIndex(opt => !opt.trim());
        if (emptyOptionIndex !== -1) {
            setMessage(`Option ${emptyOptionIndex + 1} is required.`);
            return;
        }
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            const pollData = { question, options, visibility };

            const res = await axios.post("https://polleasy-5.onrender.com/polls/createPoll", pollData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            console.log(res.data.message);
            navigate("/browse");
        } catch (err) {
            console.log("Error creating poll", err);
        }
    }


    return (
        <div className="create-poll-container">
            <div className="create-poll-card">
                <h2>Create a New Poll</h2>
                <div>
                    <label>Poll Question:</label>
                    <input type="text" className="input-ques" value={question} required onChange={(e) => setQuestion(e.target.value)} />
                </div>

                <div>
                    <label>Options:</label>
                    {options.map((option, index) => (
                        <input key={index} type="text" className="input-option" value={option} required onChange={(e) => handleOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} />
                    ))}

                    <button type="button" className="add-button" onClick={addOption}>
                        + Add Option
                    </button>
                </div>
                {message && <p style={{ color: "red", marginTop: "5px" }}>{message}</p>}
                <div>
                    <label>Visibility:</label>
                    <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                <button type="submit" className="submit" onClick={handleSubmit}>Create Poll</button>
            </div>
        </div>
    );
}
