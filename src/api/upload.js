// export function upLoadFile({
//   url= 'http://localhost:3000 ',
//   method = "post",
//   data,
//   headers = {},
//   requestList
// }) {
//   return new Promise(resolve => {
//     const xhr = new XMLHttpRequest();
//     xhr.open(method, url);
//     Object.keys(headers).forEach(key =>
//       xhr.setRequestHeader(key, headers[key])
//     );
//     xhr.send(data);
//     xhr.onload = e => {
//       resolve({
//         data: e.target.response
//       });
//     };
//   });
// }
import request from '@/utils/request'

export function upLoadFile(params) {
  return request({
    url: 'uploadFile',
    method: 'post',
    params
  })
}

export function merge(filename) {
  return request({
    url: 'merge',
    method: 'post',
    headers: {
      "content-type": "application/json"
    },
    data: JSON.stringify(filename)
  })
}

