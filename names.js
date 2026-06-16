/* 中文姓名：姓 + 名；名单字/叠字为主，双字名为常用词或常见名组合 */
const SURNAME_100=[
  '王','李','张','刘','陈','杨','黄','赵','周','吴','徐','孙','马','朱','胡','郭','何','高','林','罗',
  '郑','梁','谢','宋','唐','许','韩','冯','邓','曹','彭','曾','肖','田','董','潘','袁','蔡','蒋','余',
  '于','杜','叶','程','苏','魏','吕','丁','任','沈','姚','卢','姜','崔','钟','谭','陆','汪','范','金',
  '石','廖','贾','夏','韦','付','方','白','邹','孟','熊','秦','邱','江','尹','薛','闫','段','雷','侯',
  '龙','史','陶','黎','贺','顾','毛','郝','龚','邵','万','钱','严','覃','武','戴','莫','孔','向','汤',
  '常','康','易','乔','赖','文','庞','樊','兰','殷','施','洪','翟','安','颜','倪','牛','温','芦','季',
  '俞','章','鲁','葛','伍','申','尤','毕','聂','丛','焦','柳','邢','路','岳','齐','梅','庄','辛','管',
  '祝','左','涂','谷','祁','时','舒','耿','牟','卜','詹','关','苗','凌','费','纪','靳','盛','童','欧'
];
/** 单字名用字 */
const GIVEN_SINGLE_100=[
  '伟','芳','娜','敏','静','丽','强','磊','洋','勇','艳','杰','娟','涛','明','超','霞','平','刚','文',
  '云','兰','红','鹏','雪','建','飞','玲','桂','华','玉','梅','浩','宇','欣','怡','涵','萱','轩','博',
  '彤','睿','泽','晨','皓','俊','嘉','梓','思','雨','梦','琪','诗','婉','馨','婧','妍','琳','瑶','璐',
  '珊','菲','雯','蕾','宁','旭','阳','霖','彦','铭','航','凯','毅','诚','栋','玮','瑞','昊','朗','煜',
  '晖','晟','钊','琦','弘','翔','骏','腾','威','峰','岚','溪','松','柏','枫','柳','安','宁','悦','清',
  '雅','秀','慧','聪','颖','灵','福','乐','欢','康','泰','顺','正','直','勤','朴','温','良','和','善'
];
/** 适合叠字的名用字（丽丽、晨晨） */
const GIVEN_STACK_80=[
  '丽','娜','婷','悦','琳','瑶','璐','菲','雯','蕾','玲','娟','霞','艳','芳','敏','静','欣','怡','彤',
  '涵','萱','轩','博','睿','泽','晨','皓','俊','嘉','梓','思','雨','梦','琪','诗','婉','馨','婧','妍',
  '浩','宇','阳','霖','铭','航','凯','毅','诚','玮','瑞','昊','朗','煜','晖','晟','琦','弘','翔','骏',
  '伟','强','磊','洋','勇','杰','涛','明','超','刚','文','云','兰','红','鹏','雪','飞','桂','华','玉'
];
/** 双字名：常见人名或可读词语，不随机拼凑 */
const GIVEN_DOUBLE_120=[
  '子涵','子轩','梓涵','梓轩','梓萱','梓晨','子墨','子怡','思涵','思琪','思雨','思远','雨萱','雨桐','雨欣','雨泽',
  '欣怡','欣悦','欣然','俊杰','俊豪','俊宇','浩然','浩宇','博文','文博','天宇','天佑','嘉怡','嘉豪','嘉宁','佳音',
  '宇航','宇轩','铭轩','皓轩','晓彤','晓雪','晓明','梦瑶','梦琪','诗涵','诗雨','婉清','婧怡','语嫣','若曦','亦辰',
  '逸飞','逸轩','承泽','沐辰','景行','怀远','安宁','安然','悠然','如意','乐天','清心','明心','立新','明德','文华',
  '志明','国强','建平','建军','建华','秀英','桂芳','秀兰','丽华','玉兰','春梅','冬梅','秋月','夏荷','云舒','月明',
  '星辰','山河','江海','清风','晓峰','雪峰','松柏','竹君','兰心','梅香','芳华','淑贞','贤惠','智勇','仁义','诚信',
  '和平','康宁','福生','庆丰','永昌','长安','静安','泰然','怡然','自乐','知足','常乐','守信','守正','立言','立德',
  '承业','继先','绍祖','维藩','景明','曜文','翰飞','鹏程','鹤翔','凤鸣','麒麟','龙腾','虎跃','燕归','莺歌','鹿鸣',
  '清泉','碧云','紫萱','丹青','墨白','书瑶','琴心','棋韵','画意','诗情','棋逢','书香','翰墨','玉洁','冰清','雪莹'
];
const STRANGER_ENGLISH_NAMES=[
  'Amy','Linda','Jack','Kevin','Coco','Tony','Vivian','Jason','Mia','Leo',
  'Emma','Ryan','Lucy','Eric','Anna','David','Grace','Tom','Ivy','Alex'
];

const FEM_GIVEN_CHARS='芳娜敏静丽艳娟霞兰红梅欣怡涵萱琪诗词婉馨婧妍琳瑶璐珊菲雯蕾婷悦秀慧';
const MASC_GIVEN_CHARS='伟强磊洋勇杰涛明超刚文鹏飞军浩宇轩博睿泽晨皓俊嘉弘翔骏威峰昊朗煜晖晟钊琦栋诚毅航凯铭';
function nameRng(rng){return rng?rng():Math.random()}
function namePick(arr,rng){return arr[Math.floor(nameRng(rng)*arr.length)]}
function filterGivenByChars(arr,chars){
  const out=arr.filter(function(c){
    for(let i=0;i<c.length;i++){if(chars.indexOf(c.charAt(i))>=0)return true}
    return false;
  });
  return out.length?out:arr.slice();
}
const GIVEN_SINGLE_FEMALE=filterGivenByChars(GIVEN_SINGLE_100,FEM_GIVEN_CHARS);
const GIVEN_SINGLE_MALE=filterGivenByChars(GIVEN_SINGLE_100,MASC_GIVEN_CHARS);
const GIVEN_STACK_FEMALE=filterGivenByChars(GIVEN_STACK_80,FEM_GIVEN_CHARS);
const GIVEN_STACK_MALE=filterGivenByChars(GIVEN_STACK_80,MASC_GIVEN_CHARS);
const GIVEN_DOUBLE_FEMALE=GIVEN_DOUBLE_120.filter(function(n){
  return /[涵萱怡悦婷妍琳瑶璐珊菲雯蕾静淑贤惠芳兰梅秋月荷]/.test(n);
});
const GIVEN_DOUBLE_MALE=GIVEN_DOUBLE_120.filter(function(n){
  return /[轩豪宇辰飞航凯毅诚栋铭瀚泽昊朗煜晖晟鹏龙虎俊杰强军建国建平建华志明国强文翰鹏程]/.test(n);
});
function givenNameFeminineScore(given){
  if(!given)return 0;
  let s=0;
  for(let i=0;i<given.length;i++){
    const ch=given.charAt(i);
    if(FEM_GIVEN_CHARS.indexOf(ch)>=0)s++;
    if(MASC_GIVEN_CHARS.indexOf(ch)>=0)s--;
  }
  return s;
}
function isGivenNameForGender(given,gender){
  if(!given)return true;
  const g=gender==='female'?'female':'male';
  const score=givenNameFeminineScore(given);
  if(score===0)return true;
  return g==='female'?score>0:score<=0;
}
function genderGivenPools(gender){
  const g=gender==='female'?'female':'male';
  return{
    single:g==='female'?GIVEN_SINGLE_FEMALE:GIVEN_SINGLE_MALE,
    stack:g==='female'?GIVEN_STACK_FEMALE:GIVEN_STACK_MALE,
    dbl:(g==='female'?GIVEN_DOUBLE_FEMALE:GIVEN_DOUBLE_MALE).length
      ?(g==='female'?GIVEN_DOUBLE_FEMALE:GIVEN_DOUBLE_MALE):GIVEN_DOUBLE_120
  };
}
/** 名部分：约 46% 单字、38% 叠字、16% 双字（词语/常见名）；按性别选字池 */
function composeGivenPart(gender,rng){
  const pools=genderGivenPools(gender);
  const r=nameRng(rng);
  if(r<0.46)return namePick(pools.single,rng);
  if(r<0.84){
    const c=namePick(pools.stack,rng);
    return c+c;
  }
  return namePick(pools.dbl,rng);
}
function fixFullNameGender(fullName,gender,rng,surnameHint){
  if(!fullName||fullName.length<2)return fullName;
  const doubles=['欧阳','司马','上官','诸葛','东方','皇甫','令狐','公孙','宇文','长孙'];
  let sur=surnameHint||'';
  if(!sur){
    for(let i=0;i<doubles.length;i++){
      if(fullName.indexOf(doubles[i])===0){sur=doubles[i];break}
    }
    if(!sur)sur=fullName.charAt(0);
  }
  const given=fullName.slice(sur.length);
  if(isGivenNameForGender(given,gender))return fullName;
  return sur+composeGivenPart(gender,rng);
}
function randomChineseFullName(gender,rng){
  return namePick(SURNAME_100,rng)+composeGivenPart(gender,rng);
}
function randomChineseGivenName(gender,rng){
  return composeGivenPart(gender,rng);
}
function pickPartnerDisplayName(gender){
  return randomChineseFullName(gender);
}
function pickBffName(playerGender){
  const g=playerGender==='female'?'female':'male';
  return randomChineseFullName(g);
}
function pickStrangerAlias(gender){
  const c=namePick(GIVEN_SINGLE_100);
  const r=Math.random();
  if(r<0.34)return '小'+c;
  if(r<0.58)return '老'+c;
  if(r<0.78)return '阿'+c;
  return namePick(STRANGER_ENGLISH_NAMES);
}
/** 路人：约 85% 真名，约 15% 小X/老X/阿X/英文名 */
function pickStrangerDisplayName(gender){
  if(Math.random()<0.15)return pickStrangerAlias(gender);
  return randomChineseFullName(gender);
}
