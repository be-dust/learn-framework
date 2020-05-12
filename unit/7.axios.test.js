// mock axios
import {fetchUser, fetchList} from './src/5.ajax';

// 在项目根目录创建一个__mocks__文件夹，下面放一个和模块同名的文件
it ('测试能否获取客户', async () => {
    let r = await fetchUser();
    expect(r).toEqual({name: 'zx'});
});

it ('测试能否获取列表', async () => {
    let r = await fetchList();
    expect(r).toEqual([1, 3, 4]);
});