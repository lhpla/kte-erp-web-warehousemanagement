import {
    ref,
    onUnmounted,
    onMounted,
    onDeactivated,
    onActivated
} from 'vue'

export const useTableHeight = (height) => {
    const tableHeight = ref(0)
    onMounted(() => {
        setHeight()
        window.addEventListener('resize', setHeight)
    })
    onActivated(() => {
        setHeight()
        window.addEventListener('resize', setHeight)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', setHeight)
    })
    onDeactivated(() => {
        window.removeEventListener('resize', setHeight)
    })
    const setHeight = () => {
        let bodayHeight = document.body.clientHeight
        tableHeight.value = bodayHeight - height
    }
    return {
        tableHeight
    }
}
