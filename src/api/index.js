import AV, { Query } from "leancloud-storage";
// 初始化leanCloud
AV.init({
  appId: "KevHy7qQ0PeY5LE99d5sRelK-MdYXbMMI",
  appKey: "LzabiOqIPn3hDLdwkYDjQ9s5",
  serverURL: "https://kevhy7qq.api.lncldglobal.com",
});

const getTopList = async () => {
  const query = new AV.Query("TopList");
  const res = await query.find();
  return res.map((item) => ({
    id: item.id,
    playerName: item.attributes.playerName,
    record: item.attributes.record,
    isShuffle: item.attributes.isShuffle,
    createDate: item.attributes.createDate,
  }));
};

const setNewRecord = async (item) => {
  // 声明 class
  const TopList = AV.Object.extend("TopList");
  // 构建对象
  const topList = new TopList();
  // 为属性赋值
  for (let i in item) {
    topList.set(i.toString(), item[i]);
  }
  try {
    // 将对象保存到云端
    const res = await topList.save();
    return {
      code: 200,
      id: res.id,
    };
  } catch (err) {
    return {
      code: 500,
      err,
    };
  }
};
const updateRecord = async (id, record) => {
  const topList = AV.Object.createWithoutData("TopList", id.toString());
  topList.set("record", parseFloat(record));
  try {
    // 将对象保存到云端
    const res = await topList.save();
    return {
      code: 200,
      id: res.id,
    };
  } catch (err) {
    return {
      code: 500,
      err,
    };
  }
};
export default {
  getTopList,
  setNewRecord,
  updateRecord,
};
