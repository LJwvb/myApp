/* eslint-disable jsx-quotes */
import { useState, useMemo } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

const Index = () => {
  const color = ["red", "yellow", "green", "blue"];
  const colorText = ["红", "黄", "绿", "蓝"];
  const rightColorToText = color.map((item) => {
    return {
      color: item,
      text: colorText[color.indexOf(item)],
    };
  });

  const colorList = colorText.flatMap((item) =>
    color.map((item2) => {
      return {
        color: item2,
        text: item,
      };
    })
  );
  // 随机获取colorList中的10个元素
  const [randomColorList, setRandomColorList] = useState(
    colorList.sort(() => Math.random() - 0.5).slice(0, 10)
  );
  // 计数
  const [rightCount, setRightCount] = useState(0);
  // 重置
  const [reset, setReset] = useState(false);
  // 判断randomColorList中的元素中有几个是正确的
  const rightCountFun = useMemo(() => {
    let count = 0;
    randomColorList.forEach((item) => {
      if (item.color === rightColorToText[colorText.indexOf(item.text)].color) {
        count++;
      }
    });
    return count;
  }, [reset]);
  const handleClick = (clickText, clickColor) => {
    // 判断是否正确
    if (clickText === rightColorToText[color.indexOf(clickColor)].text) {
      // 正确计数加1
      setRightCount(rightCount + 1);
      // 正确的元素变成灰色
      setRandomColorList(
        randomColorList.map((item) => {
          if (item.text === clickText && item.color === clickColor) {
            return {
              ...item,
              color: "gray",
            };
          }
          return item;
        })
      );
      if (rightCount + 1 === rightCountFun) {
        Taro.showToast({
          title: "恭喜你，全答对了",
          icon: "success",
          duration: 2000,
        });
      }
    } else {
      Taro.showToast({
        title: "答错了",
        icon: "error",
        duration: 1000,
      });
    }
  };
  return (
    <View className="container">
      <Text className="title">选择下列的字是什么颜色</Text>
      <View className="right-num">
        总正确个数：<Text className="num">{rightCountFun}</Text>
      </View>
      <View className="right-num">
        你的正确个数：<Text className="num">{rightCount}</Text>
      </View>
      <View className="color-box">
        {randomColorList.map((item, index) => (
          <View
            className="color-item"
            key={`${item.text}-${index}`}
            onClick={() => handleClick(item?.text, item?.color)}
            style={{ borderColor: item?.color }}
          >
            <Text className="color-text" style={{ color: item.color }}>
              {item.text}
            </Text>
          </View>
        ))}
      </View>
      <Button
        type="primary"
        onClick={() => {
          setRandomColorList(
            colorList.sort(() => Math.random() - 0.5).slice(0, 10)
          );
          // 重置计数
          setRightCount(0);
          setReset(!reset);
        }}
      >
        重置
      </Button>
    </View>
  );
};
export default Index;
