import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import { connect } from 'preact-redux'
import style from './style.css';
import reducer from '../../../reducer'
import * as actions from '../../../actions'
import Input from '../../../components/atoms/input'
import Select from '../../../components/atoms/select'
import UNKNOWN from '../../../assets/icons/icon-anonymous.jpg'
import firebase from "firebase/app";
import 'firebase/firestore';
import config from'../../../conf/firebase'

@connect(reducer, actions)
class AddProject extends Component {
	constructor(props) {
		super(props)
        this.onKeyChange = this.onKeyChange.bind(this)
        this.db = firebase.firestore()
        this.initId = this.db.collection('tasks').doc().id
        this.state = {
            tasks: [
                {
                    id: null,
                    category: null,
                    title: null
                }
            ],
          //  project: {
          //      id: '',
          //      title: null,
          //      tasks: [ this.initId ]
          //  }
        }

    }
    onKeyChange = (e) => {
        let pushId = this.db.collection('tasks').doc().id
        if(e.keyCode === 13 && e.target.value) {
            console.log(e.target.value);
            this.setState(s => ({
                tasks: [...s.tasks, {id: pushId, title: e.target.value} ],
            }))
        }


        else if(e.keyCode === 8 && !e.target.value) {
            // TODO: Filter result is false!!
            this.setState(s => ({
                tasks: s.tasks.filter(task => task.id !== e.target.dataset.key),
                project: {
                    tasks: s.tasks.filter(task => task !== e.target.dataset.key)
                }
            }))
        }
    }

    componentDidMount() {
        document.getElementById('add-task-title').focus()
        setTimeout(()=>{
            document.getElementById('add-task-title').focus()
        },100)
    }

    render() {
        if (this.props.s.set.project) {
            var Data = this.state;
            this.db.collection('tasks').doc().set(Data).catch(function(error) {
                console.error("Error writing document: ", error);
            });
            this.props.pushProjectData(false)
            this.props.openWorkSpace(true)
            dispatch(reset('myForm'))
        }
        console.log(this.state, 'state');
        console.log(this.props,'this props');
        let Tasks = this.state.tasks.map((task,i) => {
            return (
                <Input type="editableList" key={task.id} dataKey={task.id} dataIndex={i} onkeydown={this.onKeyChange} />
            )
        })
        return (
            <section class={style.r}>
                <div class={style.wrap}>
                    <div class={style.in}>
                        <h1><span>Add</span>Project</h1>
                        <div class={style.title}>
                            <input id="add-task-title" type="text" value=""  />
                        </div>
                        <div class={style.info}>
                            <div class={style.types}>
                                <p class={style.label}>Type</p>
                                <div class={style.typesInr}>
                                    <Select options={this.state.options} />
                                </div>
                            </div>
                            <div class={style.assigned}>
                                <p class={style.label}>Managed by</p>
                                <div>
                                    <ul>
                                        <li>
                                            <img src={this.props.i.thumbnail ? this.props.i.thumbnail : UNKNOWN } width="32" height="32" alt="" />
                                            <p class={style.name}>{this.props.i.firstName + ' ' + this.props.i.lastName}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class={style.assigned}>
                                <p class={style.label}>Assignee</p>
                                <div>
                                    <ul>
                                        <li> <img src={this.props.i.thumbnail ? this.props.i.thumbnail : UNKNOWN } width="32" height="32" alt="" /> </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class={style.description}>
                            <textarea placeholder="Description"></textarea>
                        </div>
                    </div>
                    <div class={style.tasks}>
                        <header>
                            <h1>Tasks</h1>
                        </header>
                        <div class={style.items}>
                            <ul id="items">
                                {Tasks}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            )
    }
}

export default AddProject
