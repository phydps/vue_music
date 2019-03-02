import {ERR_OK} from 'api/config'
import {getSongLyric} from "api/songLyric"
import {Base64} from 'js-base64'

export default class Song{
  constructor({id, mid, singer, name, album, duration, image, url}){
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {//避免多次调用接口
      return Promise.resolve(this.lyric)
    } else {
      return new Promise((resolve,reject) => {
        getSongLyric(this.mid).then((res) => {
          if (ERR_OK === res.retcode) {
            this.lyric = Base64.decode(res.lyric)
            //console.log(this.lyric)
            //"MusicJsonCallback({\"retcode\":0,\"code\":0,\"subcode\":0,\"lyric\":\"W3RpOuWRiueZveawlOeQg10KW2FyOuWRqOadsOS8pl0KW2FsOuWRqOadsOS8pueahOW6iui+ueaVheS6i10KW2J5Ol0KW29mZnNldDowXQpbMDA6MDAuMDBd5ZGK55m95rCU55CDIC0g5ZGo5p2w5LymIChKYXkgQ2hvdSkKWzAwOjA3Ljg2Xeivje+8muaWueaWh+WxsQpbMDA6MTUuNzJd5puy77ya5ZGo5p2w5LymClswMDoyMy41OV3loZ7nurPmsrPnlZQg5bem5bK455qE5ZKW5ZWhClswMDoyNi4xNl3miJHmiYvkuIDmna8g5ZOB5bCd5L2g55qE576OClswMDoyOC43OF0KWzAwOjI5LjMzXeeVmeS4i+WUh+WNsOeahOWYtApbMDA6MzEuODNdClswMDozNC4yN13oirHlupfnjqvnkbAg5ZCN5a2X5YaZ6ZSZ6LCBClswMDozNi45MF3lkYrnmb3msJTnkIMg6aOO5ZC55Yiw5a+56KGXClswMDozOS4yOV0KWzAwOjQwLjAxXeW+rueskeWcqOWkqeS4iumjngpbMDA6NDIuMTBdClswMDo0NC4wMV3kvaDor7TkvaDmnInngrnpmr7ov70KWzAwOjQ2LjU3XeaDs+iuqeaIkeefpemavuiAjOmAgApbMDA6NDkuMjJd56S854mp5LiN6ZyA5oyR5pyA6LS1ClswMDo1MS44OV3lj6ropoHpppnmpq3nmoTokL3lj7YKWzAwOjU0LjU2XeWWlCDokKXpgKDmtarmvKvnmoTnuqbkvJoKWzAwOjU3LjI2XeS4jeWus+aAleaQnueguOS4gOWIhwpbMDA6NTkuOTNd5oul5pyJ5L2g5bCx5oul5pyJ5YWo5LiW55WMClswMTowNC4xMF0KWzAxOjA1LjAxXeS6sueIseeahCDniLHkuIrkvaAKWzAxOjA4LjE3XeS7jumCo+Wkqei1twpbMDE6MTAuNjFdClswMToxMS4zM13nlJzonJznmoTlvojovbvmmJMKWzAxOjE0LjQzXQpbMDE6MTUuNjld5Lqy54ix55qEIOWIq+S7u+aApwpbMDE6MTguODVd5L2g55qE55y8552bClswMToyMS4yNF0KWzAxOjIxLjk0XeWcqOivtOaIkeaEv+aEjwpbMDE6MjUuMjNdClswMTo0OC45MF3loZ7nurPmsrPnlZQg5bem5bK455qE5ZKW5ZWhClswMTo1MS40Nl3miJHmiYvkuIDmna8g5ZOB5bCd5L2g55qE576OClswMTo1NC40M13nlZnkuIvllIfljbDnmoTlmLQKWzAxOjU2LjYzXQpbMDE6NTkuNTZd6Iqx5bqX546r55GwIOWQjeWtl+WGmemUmeiwgQpbMDI6MDIuMTRd5ZGK55m95rCU55CDIOmjjuWQueWIsOWvueihlwpbMDI6MDQuMzddClswMjowNS4yM13lvq7nrJHlnKjlpKnkuIrpo54KWzAyOjA3LjQ5XQpbMDI6MDkuMjld5L2g6K+05L2g5pyJ54K56Zq+6L+9ClswMjoxMS45MF3mg7PorqnmiJHnn6Xpmr7ogIzpgIAKWzAyOjE0LjYwXeekvOeJqeS4jemcgOaMkeacgOi0tQpbMDI6MTcuMjZd5Y+q6KaB6aaZ5qat55qE6JC95Y+2ClswMjoxOS45M13llpQg6JCl6YCg5rWq5ryr55qE57qm5LyaClswMjoyMi42NV3kuI3lrrPmgJXmkJ7noLjkuIDliIcKWzAyOjI1LjI3XeaLpeacieS9oOWwseaLpeaciSDlhajkuJbnlYwKWzAyOjI5LjIzXQpbMDI6MzAuMzFd5Lqy54ix55qEIOeIseS4iuS9oApbMDI6MzMuNThd5LuO6YKj5aSp6LW3ClswMjozNi4wM10KWzAyOjM2LjYwXeeUnOicnOeahOW+iOi9u+aYkwpbMDI6MzkuNjVdClswMjo0MC45NF3kurLniLHnmoQg5Yir5Lu75oCnClswMjo0NC4yMF3kvaDnmoTnnLznnZsKWzAyOjQ2LjcwXQpbMDI6NDcuMjZd5Zyo6K+05oiR5oS/5oSPClswMjo1MC44MV0KWzAyOjUxLjc2XeS6sueIseeahCDniLHkuIrkvaAKWzAyOjU0LjUyXQpbMDI6NTUuMDVd5oGL54ix5pel6K6wClswMjo1Ny4zMF0KWzAyOjU3LjkzXemjmOmmmeawtOeahOWbnuW/hgpbMDM6MDAuNzJdClswMzowMi4zM13kuIDmlbTnk7Yg55qE5qKm5aKDClswMzowNS40Ml3lhajpg73mnInkvaAKWzAzOjA3LjkxXQpbMDM6MDguNjRd5pCF5ouM5Zyo5LiA6LW3ClswMzoxMS4zOV0KWzAzOjEzLjAyXeS6sueIseeahOWIq+S7u+aApwpbMDM6MTYuMjNd5L2g55qE55y8552bClswMzoxOS45OV0KWzAzOjIxLjMxXeWcqOivtOaIkeaEv+aEjw==\",\"trans\":\"\"})"
            resolve(this.lyric)
          } else {
            reject('no lyric')
          }
        })
      })
    }
  }

}


export function createdSong(musicData,songVkey){
  return new Song({
    id:musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    //url: `http://ws.stream.qqmusic.qq.com/${musicData.songmid}.m4a?fromtag=00`
    //url:`http://61.240.152.26/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=4733453868&uin=0&format=66`
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${songVkey}`
  })
}

/*
* http://61.240.152.27/amobile.music.tc.qq.com/C400001OyHbk2MSIi4.m4a?guid=4733453868&vkey=64D7EEBCB1CCDA8019836B2204B8765309B7987A2E21B77B2457ABC56EBBB6A101FF19BB0FE9D6CA30DE1F4D88B4FF94E21BEDCD2CD724E7&uin=0&fromtag=38
* */

function filterSinger(singers){

  let arr = []
  if (!singers){
    return ''
  }
  singers.forEach((item) => {
    arr.push(item.name)
  })

  return arr.join('/')
}
