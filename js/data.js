//旅行社資料
let data1 = [{
  "categorie": "雄獅",
  "values": [{
      "value": 1959681,
      "rate": "108/12"
    },
    {
      "value": 2441590,
      "rate": "109/01"
    },
    {
      "value": 1624781,
      "rate": "109/02"
    },
    {
      "value": 383251,
      "rate": "109/03"
    },
    {
      "value": 101070,
      "rate": "109/04"
    }
  ]
}]
let data2 = [{
  "categorie": "鳳凰",
  "values": [{
      "value": 105253,
      "rate": "108/12"
    },
    {
      "value": 119788,
      "rate": "109/01"
    },
    {
      "value": 214290,
      "rate": "109/02"
    },
    {
      "value": 39115,
      "rate": "109/03"
    },
    {
      "value": 11605,
      "rate": "109/04"
    }
  ]
}]
let data3 = [{
  "categorie": "五福",
  "values": [{
      "value": 339660,
      "rate": "108/12"
    },
    {
      "value": 512599,
      "rate": "109/01"
    },
    {
      "value": 321772,
      "rate": "109/02"
    },
    {
      "value": 48247,
      "rate": "109/03"
    },
    {
      "value": 9450,
      "rate": "109/04"
    }
  ]
}]
let data4 = [{
  "categorie": "山富",
  "values": [{
      "value": 324168,
      "rate": "108/12"
    },
    {
      "value": 382187,
      "rate": "109/01"
    },
    {
      "value": 302006,
      "rate": "109/02"
    },
    {
      "value": 44614,
      "rate": "109/03"
    },
    {
      "value": 10902,
      "rate": "109/04"
    }
  ]
}]
let data5 = [{
  "categorie": "燦星",
  "values": [{
      "value": 53656,
      "rate": "108/12"
    },
    {
      "value": 61205,
      "rate": "109/01"
    },
    {
      "value": 40262,
      "rate": "109/02"
    },
    {
      "value": 7380,
      "rate": "109/03"
    },
    {
      "value": 1339,
      "rate": "109/04"
    }
  ]
}]

//出境、入境資料
const arrivalData = {
  Japan: [{
    "month": "12月",
    "number": 631547
  }, {
    "month": "1月",
    "number": 564957
  }, {
    "month": "2月",
    "number": 446706
  }, {
    "month": "3月",
    "number": 33074
  }],
  China: [{
    "month": "12月",
    "number": 342724
  }, {
    "month": "1月",
    "number": 360551
  }, {
    "month": "2月",
    "number": 35995
  }, {
    "month": "3月",
    "number": 7797
  }],
  Hongkong: [{
    "month": "12月",
    "number": 340485
  }, {
    "month": "1月",
    "number": 323327
  }, {
    "month": "2月",
    "number": 51728
  }, {
    "month": "3月",
    "number": 4961
  }],
  Korea: [{
    "month": "12月",
    "number": 246990
  }, {
    "month": "1月",
    "number": 245645
  }, {
    "month": "2月",
    "number": 99121
  }, {
    "month": "3月",
    "number": 2064
  }],
  Vietnam: [{
    "month": "12月",
    "number": 136851
  }, {
    "month": "1月",
    "number": 145323
  }, {
    "month": "2月",
    "number": 140331
  }, {
    "month": "3月",
    "number": 48638
  }],
  Usa: [{
    "month": "12月",
    "number": 150266
  }, {
    "month": "1月",
    "number": 141438
  }, {
    "month": "2月",
    "number": 81012
  }, {
    "month": "3月",
    "number": 58017
  }],
  Thailand: [{
    "month": "12月",
    "number": 134369
  }, {
    "month": "1月",
    "number": 119937
  }, {
    "month": "2月",
    "number": 98307
  }, {
    "month": "3月",
    "number": 26826
  }],
  Philippines: [{
    "month": "12月",
    "number": 105791
  }, {
    "month": "1月",
    "number": 115628
  }, {
    "month": "2月",
    "number": 63269
  }, {
    "month": "3月",
    "number": 28319
  }],
  Singapore: [{
    "month": "12月",
    "number": 99865
  }, {
    "month": "1月",
    "number": 77845
  }, {
    "month": "2月",
    "number": 52618
  }, {
    "month": "3月",
    "number": 17383
  }],
  Malaysia: [{
    "month": "12月",
    "number": 78128
  }, {
    "month": "1月",
    "number": 53065
  }, {
    "month": "2月",
    "number": 50234
  }, {
    "month": "3月",
    "number": 15430
  }]
}
const departureData = {
  Japan: [{
      "country": "日本",
      "plane": 3195,
      "passenger": 578996,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "日本",
      "plane": 3222,
      "passenger": 665882,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "日本",
      "plane": 2922,
      "passenger": 348260,
      "month": 2,
      "level": "1,2",
      "date": "2020/2/14,2020/2/22"
    },
    {
      "country": "日本",
      "plane": 936,
      "passenger": 33581,
      "month": 3,
      "level": "3",
      "date": "2020/3/19"
    }
  ],
  China: [{
      "country": "中國大陸",
      "plane": 2379,
      "passenger": 336496,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "中國大陸",
      "plane": 2418,
      "passenger": 278271,
      "month": 1,
      "level": "3",
      "date": "2020/1/28"
    },
    {
      "country": "中國大陸",
      "plane": 593,
      "passenger": 53496,
      "month": 2,
      "level": "3",
      "date": ""
    },
    {
      "country": "中國大陸",
      "plane": 410,
      "passenger": 50271,
      "month": 3,
      "level": "3",
      "date": ""
    }
  ],
  Hongkong: [{
      "country": "香港",
      "plane": 1654,
      "passenger": 316321,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "香港",
      "plane": 1659,
      "passenger": 309361,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "香港",
      "plane": 559,
      "passenger": 73662,
      "month": 2,
      "level": "3",
      "date": "2020/2/11"
    },
    {
      "country": "香港",
      "plane": 141,
      "passenger": 16952,
      "month": 3,
      "level": "3",
      "date": ""
    }
  ],
  Korea: [{
      "country": "南韓",
      "plane": 1214,
      "passenger": 241424,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "南韓",
      "plane": 1293,
      "passenger": 267840,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "南韓",
      "plane": 931,
      "passenger": 83120,
      "month": 2,
      "level": "1,2,3",
      "date": "2020/2/20,2020/2/22,2020/2/24"
    },
    {
      "country": "南韓",
      "plane": 76,
      "passenger": 4348,
      "month": 3,
      "level": "3",
      "date": ""
    }
  ],
  Vietnam: [{
      "country": "越南",
      "plane": 877,
      "passenger": 143832,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "越南",
      "plane": 1022,
      "passenger": 186350,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "越南",
      "plane": 909,
      "passenger": 86524,
      "month": 2,
      "level": "0",
      "date": ""
    },
    {
      "country": "越南",
      "plane": 327,
      "passenger": 26892,
      "month": 3,
      "level": "3",
      "date": "2020/3/19"
    }
  ],
  Usa: [{
      "country": "美國",
      "plane": 491,
      "passenger": 126012,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "美國",
      "plane": 506,
      "passenger": 163729,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "美國",
      "plane": 450,
      "passenger": 112411,
      "month": 2,
      "level": "0",
      "date": ""
    },
    {
      "country": "美國",
      "plane": 320,
      "passenger": 49594,
      "month": 3,
      "level": "3",
      "date": "2020/3/19"
    }
  ],
  Thailand: [{
      "country": "泰國",
      "plane": 582,
      "passenger": 133668,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "泰國",
      "plane": 600,
      "passenger": 136985,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "泰國",
      "plane": 544,
      "passenger": 76423,
      "month": 2,
      "level": "1",
      "date": "2020/2/11"
    },
    {
      "country": "泰國",
      "plane": 257,
      "passenger": 15269,
      "month": 3,
      "level": "3",
      "date": "2020/3/19"
    }
  ],
  Philippines: [{
      "country": "菲律賓",
      "plane": 570,
      "passenger": 121121,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "菲律賓",
      "plane": 574,
      "passenger": 115941,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "菲律賓",
      "plane": 348,
      "passenger": 43823,
      "month": 2,
      "level": "0",
      "date": ""
    },
    {
      "country": "菲律賓",
      "plane": 193,
      "passenger": 18507,
      "month": 3,
      "level": "3",
      "date": "2020/3/19"
    }
  ],
  Singapore: [{
      "country": "新加坡",
      "plane": 400,
      "passenger": 103828,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "新加坡",
      "plane": 387,
      "passenger": 99389,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "新加坡",
      "plane": 344,
      "passenger": 41060,
      "month": 2,
      "level": "2",
      "date": "2020/2/11"
    },
    {
      "country": "新加坡",
      "plane": 174,
      "passenger": 18280,
      "month": 3,
      "level": "3",
      "date": "2020/3/19"
    }
  ],
  Malaysia: [{
      "country": "馬來西亞",
      "plane": 340,
      "passenger": 80660,
      "month": 12,
      "level": "0",
      "date": ""
    },
    {
      "country": "馬來西亞",
      "plane": 335,
      "passenger": 78230,
      "month": 1,
      "level": "0",
      "date": ""
    },
    {
      "country": "馬來西亞",
      "plane": 314,
      "passenger": 35827,
      "month": 2,
      "level": "0",
      "date": ""
    },
    {
      "country": "馬來西亞",
      "plane": 170,
      "passenger": 13062,
      "month": 3,
      "level": "3",
      "date": "2020/3/19"
    }
  ]
};