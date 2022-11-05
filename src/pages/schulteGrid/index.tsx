/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-quotes */
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

const SchulteGrid = () => {
  const [time, setTime] = useState(0);
  const timeRef = useRef<any>(null);
  // 开始
  const [start, setStart] = useState(false);
  // 重置
  const [reset, setReset] = useState(false);
  // 正确1到25的数组
  const unmList = useMemo(() => {
    return Array.from({ length: 25 }, (v, k) => k + 1);
  }, [start]);
  // 随机1到25的数组
  const randomUnm = useMemo(() => {
    const arr = Array.from({ length: 25 }, (v, k) => k + 1).sort(
      () => Math.random() - 0.5
    );
    // 给每个元素添加一个属性color
    return arr.map((item) => {
      return {
        num: item,
        color: "white",
      };
    });
  }, [reset]);
  const [randomUnmList, setRandomUnmList] = useState(randomUnm);

  const handleClick = (num) => {
    //时间为0，不能点击
    if (time === 0 && !start) {
      Taro.showToast({
        title: "请先开始",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    // 判断当前点击的数字是否是numList中的数字排在第一位的数字
    if (num === unmList[0]) {
      // 把当前点击的数字变成灰色
      const newRandomUnmList = randomUnmList.map((item) => {
        if (item.num === num) {
          return {
            ...item,
            color: "gray",
          };
        }
        return item;
      });
      setRandomUnmList(newRandomUnmList);
      // 如果是，将numList中的第一位数字删除
      unmList.splice(unmList.indexOf(num), 1);
      // 如果numList中的数字都被删除了，就结束
      if (unmList.length === 0) {
        Taro.showToast({
          title: "恭喜你完成了",
          icon: "success",
          duration: 2000,
        });
        clearInterval(timeRef.current);
      }
    }
  };
  const onStart = useCallback(() => {
    clearInterval(timeRef.current);
    setTime(0);
    if (start) {
      setReset(!reset);
      setStart(false);
    } else {
      setStart(true);
      // 开始计时
      timeRef.current = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }
  }, [start]);
  useEffect(() => {
    setRandomUnmList(randomUnm);
  }, [reset]);
  return (
    <View className="schulte-grid">
      <View className="schulte-grid-title">Schulte Grid</View>
      <View className="schulte-grid-event">
        <Button type="primary" onClick={onStart} className="start-but">
          {start ? "重新开始" : "开始"}
        </Button>
        <Text className="time">{time}</Text>
      </View>
      <View className="schulte-grid-content">
        {randomUnmList.map((item, i) => (
          <View
            className="schulte-grid-content-item"
            key={i}
            onClick={() => handleClick(Number(item?.num))}
            style={{ backgroundColor: item?.color }}
          >
            {item?.num}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SchulteGrid;
