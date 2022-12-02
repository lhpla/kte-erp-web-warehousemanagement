<!-- 存单资料 -->
<template>
    <div id="SaveListData">
        <el-dialog title="存档资料" width="600px" v-model="saveVisible" :close-on-click-modal="false" destroy-on-close
            @close="closeFile" :close-on-press-escape="false">
            <div v-show="fileList.length" class="fileName">
                <i v-show="fileList.length && fileList[0].name" class="el-icon-document-remove"></i> {{ fileList.length && fileList[0].name ? fileList[0].name : '-' }}
            </div>
            <div class="flex">
                <el-upload @click="removeBefore" ref="upload" style="width:80px;height:30px;line-height:normal"
                    action="" :file-list="fileList" :auto-upload="true" :http-request="uploadfile" :limit="limit"
                    :on-error="handleAvatarError" :on-exceed="handleExceed" :show-file-list="false">
                    <el-button size="small" :loading="upLoding" type="primary">{{ fileList.length && fileList[0].url ?
                            '重新上传' : '上传资料'
                    }}
                    </el-button>
                </el-upload>
                <el-button v-if="fileList.length && fileList[0].url" size="small" @click="downFile" type="primary"
                    :loading="upLoding" :disabled="upLoding">
                    下载资料
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue';
export default {
    name: 'SaveListData',
    setup(prop, ctx) {
        const data = reactive({
            saveVisible: false,
            fileList: [],
            upLoding: false,
            limit: 1,
            shippingId: ''
        })
        const { ctx: vueDev, proxy: vue } = getCurrentInstance();
        const api = vue.$http;
        onBeforeMount(() => { })
        onMounted(() => { })
        const refData = toRefs(data);
        //获取基础信息
        const getMsg = row => {
            data.fileList = [];
            data.shippingId = row.shippingId
            data.saveVisible = true
            api.documentList.getDocumentPath({ shippingId: row.shippingId }).then(res => {
                if (res.code == 200) {
                    data.fileList = [res.data]
                }
            })
        }
        //移除数据
        const removeBefore = () => {
            data.fileList = [];
        };
        //下载
        const downFile = () => {
            data.upLoding = true;
            api.documentList.downloadDocumentPath({ shippingId: data.shippingId }).then(res => {
                if (res.code == 200) {
                    vue.$message.success(res.msg)
                    window.open(res.data);
                    data.upLoding = false;
                } else {
                    vue.$message.warning(res.msg)
                    data.upLoding = false;
                }
            }).catch(() => {
                data.upLoding = false;
            })

        }
        // 自定义上传方法
        const uploadfile = file => {
            data.upLoding = true;
            let formImgData = new FormData();
            formImgData.append("file", file.file);
            formImgData.append("pathName", file.file.name);
            //    formImgData.append("pathName", '/warehouseManagement/document');
            api.uploadImg
                .uploadImgAllFun(formImgData)
                .then(res => {
                    if (res.code == 200) {

                        file.onSuccess();
                        let fileObj = {
                            name: res.data.originalName,
                            url: res.data.link,
                            shippingId: data.shippingId
                        };
                        data.fileList.push(fileObj);
                        saveDocumentPath(fileObj)
                    } else {
                        file.onError();
                        data.upLoding = false;
                    }
                })
                .catch(err => {
                    data.upLoding = false;
                });
        };
        //保存文件
        const saveDocumentPath = msg => {
            api.documentList.saveDocumentPath(msg).then(res => {
                if (res.code == 200) {
                    data.upLoding = false;
                    vue.$message.success(res.msg)
                } else {
                    data.upLoding = false;
                    removeBefore()
                    vue.$message.warning(res.msg)
                }
            }).catch(() => {
                removeBefore()
                data.upLoding = false;
            })
        }
        // 上传文件成功钩子
        // const handleAvatarSuccess = file => {
        //     vue.$message.success("上传文件成功!");
        // };

        // 上传文件失败钩子
        const handleAvatarError = file => {
            data.upLoding = false;
            vue.$message.error("文件异常，请重新上传!");
        };

        // 文件超出个数限制时的钩子
        const handleExceed = file => {
            data.upLoding = false;
            vue.$message.error("上传文件不能超过1个!");
        };

        //关闭弹窗
        const closeFile = () => {
            data.fileList = [];
            data.saveVisible = false
        }
        return {
            ...refData,
            getMsg,
            downFile,
            uploadfile,
            handleExceed,
            handleAvatarError,
            // handleAvatarSuccess,
            closeFile,
            removeBefore,
            saveDocumentPath,
        }
    }
};
</script>
<style scoped lang='scss'>
#SaveListData {
    :deep(.el-upload) {
        width: 80px;
        height: 30px;
        line-height: normal
    }

    .flex {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .fileName {
        text-align: center;
        margin: 20px 0;
        font-size: 15px;
    }

    :deep(.el-dialog__header) {
        margin-right: 0;
    }

}
</style>