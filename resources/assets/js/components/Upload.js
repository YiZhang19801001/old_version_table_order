import React from "react"
import axios from "axios"

class Upload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingText: '正在导入',
            result: '',
            files: []
        }

        this.uploadSizes = this.uploadSizes.bind(this);
    }


    uploadSizes(e) {
        e.preventDefault();
        if (this.state.files[0]) {
            this.setState({ loading: true, loadingText: '正在导入' });
            let formData = new FormData();
            formData.append('size_file', this.state.files[0])
            axios.post(`/table/public/api/upload`, formData)
                .then(res => {
                    this.setState({ loading: false, loadingText: '' });
                    if (res.data.code === '0') {
                        this.setState({ result: `录入数据成功,新建${res.data.created}条，更新${res.data.updated}条` })
                    }
                    else {
                        this.setState({ result: `录入数据失败,${res.data.message}` })
                    }
                })
                .catch(err => {
                    this.setState({ loading: false, loadingText: '', result: `录入数据失败,${err.response.data.message}` });

                })
        }
    }

    render() {
        return (
            <div>
                <input
                    name=""
                    type="file"
                    id="sizesXls"
                    onChange={(e) => { this.setState({ files: e.target.files }) }}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
                <button
                    onClick={this.uploadSizes}
                >
                    开始上传
                </button>
                <p>
                    {this.state.result}
                </p>
            </div>
        )
    }
}

export default Upload