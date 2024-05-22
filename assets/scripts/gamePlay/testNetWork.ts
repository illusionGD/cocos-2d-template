import { _decorator, Component, Node } from 'cc'
import request from '../network/request'
const { ccclass, property } = _decorator

@ccclass('testNetWork')
export class testNetWork extends Component {
    start() {}

    testApi() {
        // request
        //     .get<any[]>('http://jsonplaceholder.typicode.com/posts')
        //     .then((res) => {
        //         console.log('🚀 ~ res:', res)
        //     })
        request.post('http://jsonplaceholder.typicode.com/posts', {
            userId: 1,
            title: '',
            body: '',
        }).then(res => {
            console.log("🚀 ~ res:", res)
            
        })
    }

    update(deltaTime: number) {}
}
