import { Component } from '@angular/core';

@Component({
  selector: 'not-found',
  template: `
    <div style="margin: 250px auto; background-color: #fafafa; width:100%; height:400px;text-align: center;padding: 50px 0;">
      <img src="/assets/img/Page_ErrorPage.png" width="300px" height="300px"/>
      <div style="font-size: 20px;color: #9b9b9b;margin-bottom: 20px;">앗! 문제가 생겼네요.</div>
      <button style="text-align: center; width: 265px;height: 45px;border-radius: 25px;background-color: #fafafa;border: solid 1px #fd884d;font-size:14px;color:#fd884d" gotoIndex KlueBtn>
        클루 메인 화면으로 돌아가기
      </button>
    </div>
  `
})
export class PageNotFoundComponent {}
