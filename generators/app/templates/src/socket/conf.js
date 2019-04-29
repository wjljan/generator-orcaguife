export const socketEventChannel = {
    test: () => '测试',
};

export const eventCodeForEventChannel = {
    // socket event codes group by different business channels

    // test channel
    test: [0],
};

export const socketEventCode = {
    // code 1-10 are for test channel
    0: (target, result) => `测试${target}开始${result ? '成功' : '失败'}！`,
};