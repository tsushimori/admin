import { h, Component } from 'preact';
import { Router } from 'preact-router';
import Header from './organisms/header';
import Home from 'async!../routes/home';
import Projects from 'async!../routes/projects';
import Marketing from 'async!../routes/marketing';
import MarketingAnalysis from 'async!../routes/marketing/analysis';
import MarketingResearch from 'async!../routes/marketing/research';
import MarketingStrategies from 'async!../routes/marketing/strategies';
import MarketingInternet from 'async!../routes/marketing/internet';
import MarketingDirect from 'async!../routes/marketing/direct';
import MarketingServices from 'async!../routes/marketing/services';
import MarketingPricing from 'async!../routes/marketing/pricing';
import Management from 'async!../routes/management';
import ManagementShifts from 'async!../routes/management/shifts';
import ManagementBilling from 'async!../routes/management/billing';
import Support from 'async!../routes/support';
import Profile from 'async!../routes/profile';
import Docs from 'async!../routes/docs';
import Main from '../components/organisms/main';
import PersonalMenu from '../components/organisms/personalMenu';
import WorkSpace from '../components/organisms/workSpace';
import Login from '../components/pages/login';
import Loading from '../components/pages/loading';
import Search from '../components/molecules/search';
//import Comment from '../components/molecules/comment';
import Message from '../components/molecules/message';
import AddList from '../components/molecules/addList';
import Button from '../components/atoms/button';
import { connect } from 'preact-redux'
import reducer from '../reducer'
import * as actions from '../actions'
import config from '../conf/firebase'

import firebase from "firebase/app";
import 'firebase/firestore';

@connect(reducer, actions)
class App extends Component {
    constructor(props) {
        super(props)
        let that = this
        firebase.initializeApp(config)
        this.db = firebase.firestore()
        this.db.settings({timestampsInSnapshots: true})
        this.state = {
            loading: true
        }
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                let uid = user.uid
                that.db.collection("people").where('user', '==', true).onSnapshot(function(docs) {
                    let currentUser = {}
                    let users = {}
                    docs.forEach(function(doc) {
                        doc.data().uid === uid ? currentUser = doc.data() : null
                        users[doc.data().uid] = doc.data()
                    })
                    that.props.login(currentUser, users)
                    that.setState({loading: false})
                })
            } else {
                that.setState({loading: false})
            }
        })
    }

    handleRoute = e => { this.currentUrl = e.url }

    render() {
        if(this.state.loading) {
            return <Loading />
        } else if (this.props.s.login) {
            return (
                <div id="app">
                    <Search />
                    <Header />
                    <Main>
                        <Router onChange={this.handleRoute}>
                            <Home path="/"/>
                            <Profile path="/profile/" user="me" />
                            <Profile path="/profile/:user" />
                            <Docs path="/docs/" />
                            <Projects path="/projects/" id="0" />
                            <Projects path="/projects/:id" />
                            <Marketing path="/marketing/" />
                            <MarketingAnalysis path="/marketing/analysis" />
                            <MarketingResearch path="/marketing/research" />
                            <MarketingStrategies path="/marketing/strategies" />
                            <MarketingInternet path="/marketing/internet" />
                            <MarketingDirect path="/marketing/direct" />
                            <MarketingServices path="/marketing/services" />
                            <MarketingPricing path="/marketing/pricing" />
                            <Management path="/management/" />
                            <ManagementShifts path="/management/shifts/" />
                            <ManagementBilling path="/management/billing/" />
                            <Support path="/support/" />
                        </Router>
                    </Main>
                    <WorkSpace />
                    <Button type="add" />
                    <AddList />
                    <PersonalMenu />
                    <Message txt={this.props.s.data.error} />
                </div>
            )
        } else {
            return <Login />
        }
    }
}

export default App
//that.db.collection('people').doc().set(doc.data())
