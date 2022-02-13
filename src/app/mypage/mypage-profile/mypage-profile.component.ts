import {Component, Inject, Renderer, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../user.service';
import {SharedService} from '../../shared-service';
import {MypageService} from '../mypage.service';
import {RoutingService} from '../../routing.service';
import {DOCUMENT} from '@angular/platform-browser';
import {MypageInfo} from '../../object/user-info';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';

@Component({
  selector: 'mypage-profile',
  templateUrl: './mypage-profile.component.html',
  styleUrls: ['./mypage-profile.component.css']
})
export class MypageProfileComponent implements OnInit{
  isSelect:boolean = false;
  isFocus:boolean = false;
  isOpen: boolean = false;
  isOut: boolean = true;
  profile_name:string;
  clickListener:any;
  isProfileDefault : boolean = true;
  imageStorage:any;
  cropperSettings: CropperSettings;

  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;


  constructor(private mypageService: MypageService,
              private userService: UserService,
              private routingService: RoutingService,
              private sharedService: SharedService,
              private renderer: Renderer,
              @Inject(DOCUMENT) private document: Document) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 300;
    this.cropperSettings.height = 300;
    this.cropperSettings.croppedWidth = 300;
    this.cropperSettings.croppedHeight = 300;
    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 500;
    this.cropperSettings.noFileInput = true;
    this.imageStorage = {};
  }

  ngOnInit(){
    if(this.userService.userInfo.profile.indexOf("assets") == -1)
      this.isProfileDefault = false;
    else
      this.isProfileDefault = true;
  }

  onChangeImage(event) {
    this.profileSelect();

    let image:File = event.target.files[0] || event.srcElement.files[0];

    if (!image) {
      return;
    } else{
      if (image.size > 2 * 1024 * 1024) {
        alert('용량이 2MB 이하의 이미지만 가능합니다.');
        event.target.value = "";
        return;
      } else {
        let image1:any = new Image();
        let myReader:FileReader = new FileReader();
        let that = this;
        this.isOpen = true;
        myReader.onloadend = function (loadEvent:any) {
          image1.src = loadEvent.target.result;
          that.cropper.setImage(image1);
        };

        myReader.readAsDataURL(image);
      }
    }
  }

  imageUpload(){
    let data = new FormData();
    let imageFile = this.dataURItoBlob(this.imageStorage.image);

    data.append('profile', imageFile);
    this.mypageService.setProfile(data).subscribe(data =>{
      if(data.code==200){
        alert('프로필 사진 바꾸는데 성공했습니다.');
        window.location.reload();
      }else{
        alert('오류가 발생했습니다. 잠시 뒤에 다시 시도해주세요.');
        console.log(data);
      }
    })
  }

  clickDelete(){
    if(this.isProfileDefault)
      return;
    this.profileSelect();
    this.mypageService.deleteProfile().subscribe(data =>{
      if(data.code == 200){
        alert('기본 프로필 사진 변경에 성공했습니다.');
        window.location.reload();
      }else if(data.code == 60102) {
        alert('이미 기본 프로필 사진으로 설정되어 있습니다.');
      }else {
        alert('오류가 발생했습니다. 잠시 뒤에 다시 시도해주세요.');
        console.log(data);
      }
    })
  }

  focusUpload(state:boolean){
    this.isFocus = state;
  }

  profileSelect(){
    this.isSelect = !this.isSelect;

    if(this.isSelect){
      this.clickListener = this.renderer.listen(this.document.body, "click", (event)=>{
        let isClickCamera:boolean;
        if(event.target.tagName == "IMG"){
          if(event.target.currentSrc.indexOf("Camera") == -1)
            isClickCamera = false;
          else
            isClickCamera = true;
        }else
          isClickCamera = false;

        if(!this.isFocus && !isClickCamera)
          this.profileSelect();
      });
    }else
      this.clickListener();
  }


  dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});
  }


  modalOut() {
    if (this.isOut)
      this.isOpen = false;
  }
}
