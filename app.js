//1번파티 , 2번파티 버튼누를시 버튼들 색상변경,밑 flag 지정
const cp_btn_party1 = document.querySelector('#btn_party1');
const cp_btn_party2 = document.querySelector('#btn_party2');
let party_flag = null;

cp_btn_party1.addEventListener('click', ()=>{

    const element = document.getElementsByClassName('btn');
    for(let i = 0; i < 23; i++){
        element[i].style.cssText = 'background-color:rgb(255, 252, 200)';
    }
    party2_border.style.cssText = 'border""';
    party1_border.style.cssText = 'border:2px solid black';
    party_flag = 1;
    
});

cp_btn_party2.addEventListener('click', ()=>{   

    const element = document.getElementsByClassName('btn');
    for(let i = 0; i < 23; i++){
        element[i].style.cssText = 'background-color: #d1e5ff';
    }
    party1_border.style.cssText = 'border:""';
    party2_border.style.cssText = 'border:2px solid black';
    party_flag = 2;
    
})

////////////////////////////////////////////////
//클래스 버튼을 누를시 순서대로 각파티 input 에 직업들을 나열해 넣어준다
//flag 변수로 1파티 2파티를 구분한다
let input_party1 = document.getElementsByClassName('party1');
let input_party2 = document.getElementsByClassName('party2');
const x = document.getElementsByClassName('btn')
let m = 0;
let n = 0;
for(let i = 0; i < 23; i++){
    x[i].addEventListener('click', ()=>{
        if(party_flag === 1){

            if(m < 4){
                input_party1[m].value = x[i].textContent;
                m++;
            }else if(m === 4){
                m = 4;
                alert("1파티 Full");
            }

        }
            
        
        else if(party_flag === 2){
            if(n < 4){
                input_party2[n].value = x[i].textContent;
                n++;
            }else if(n === 4){
                n = 4;
                alert("2파티 Full");
            }
        }                
    });
}

//뒤로가기 
//추가한 클래스를 지울수 있다.
const btn_back = document.querySelector('#btn_back');
btn_back.addEventListener('click', ()=>{

    if(party_flag === 1){
        input_party1[m-1].value = '';
        m--;

        if(m < 0){
            m++;
        } 
    }

    if(party_flag === 2){
        input_party2[n-1].value = '';
        n--;

        if(n < 0){
            n++;
        }
    }
});


//reset 
const cp_btn_clear = document.querySelector('#btn_clear');
cp_btn_clear.addEventListener('click', ()=>{
    m = 0;
    n = 0;
    party_flag = null;
    const element = document.getElementsByClassName('btn');
    for(let i = 0; i < 23; i++){
        element[i].style.cssText = 'background-color:""';
    }

    for(let i = 0; i < 4; i++){
        input_party1[i].value = '';
        input_party2[i].value = '';
    }
    party1_border.style.cssText = 'border:""';
    party2_border.style.cssText = 'border:""';
    
    show_result(3); // show_result 함수가 3을 받으면 result 값들을 모두 null로서 초기화한다.

});

////////////////////////////////////////////////////////////////
//각 시너지 효과 global 변수 세팅 // 상시:always 순간:moment
///
let critical_increase_a = 0; //치적률
let critical_increase_m = 0;

let damage_increase_a = 0; //피해량 증가율
let damage_increase_m = 0;
let attack_increase_a = 0; //공격력 증가율
let attack_increase_m = 0;
let backHead_increase_a = 0; //벡해드 증가율
let backHead_increase_m = 0;
let ignore_defence_a = 100;// 방깍
let ignore_defence_m = 100;
let total_damage_increase_a = 0;//총 데미지 증가율
let total_damage_increase_m = 0;
let total_damage_increase_c = 0; //상시데미지증가 + 순간데미지증가/2 로 평균 데미지 증가율 계산함
///
let attack_speed = 0; //공속증가 상시
let attack_speed_m = 0; //순간 공속증가
let move_speed = 0; // 이속증가 상시
let move_speed_m = 0; // 순간 이속증가

let neutralization = null; //무력화

let shield = null; //쉴드
let purification = 0; // 정화

let synergy_score = null; // 최종 파티 시너지 등급


///////////////////// input에 입력된 클래스들을 배열에 저장하기
let element_party1 = document.getElementsByClassName('party1');
let element_party2 = document.getElementsByClassName('party2');


//결과값 출력 input들을 변수로 만들어주기(유지보수를 위해)
const cp_critical1 = document.querySelector('#critical1');
const cp_critical2 = document.querySelector('#critical2');

const cp_damage1 = document.querySelector('#damage1');
const cp_damage2 = document.querySelector('#damage2');
const cp_attack1 = document.querySelector('#attack1');
const cp_attack2 = document.querySelector('#attack2');
const cp_backHead1 = document.querySelector('#backHead1');
const cp_backHead2 = document.querySelector('#backHead2');
const cp_ignore1 = document.querySelector('#ignore1');
const cp_ignore2 = document.querySelector('#ignore2');
const cp_total_damage1 = document.querySelector('#total_damage1');
const cp_total_damage2 = document.querySelector('#total_damage2');

const cp_attack_speed1 = document.querySelector('#attack_speed1');
const cp_attack_speed2 = document.querySelector('#attack_speed2');
const cp_move_speed1 = document.querySelector('#move_speed1');
const cp_move_speed2 = document.querySelector('#move_speed2');

const cp_neutralization1 = document.querySelector('#neutralization1');
const cp_neutralization2 = document.querySelector('#neutralization2');
const cp_purification1 = document.querySelector('#purification1');
const cp_purification2 = document.querySelector('#purification2');
const cp_shield1 = document.querySelector('#shield1');
const cp_shield2 = document.querySelector('#shield2');

const cp_score1 =  document.querySelector('#score1');
const cp_score2 =  document.querySelector('#score2');

// 무력화 시너지 계산 구현칸
let S = 0;  
let A = 0;
let B = 0;
let C = 0;
let D = 0;
//전역변수 구성된파티에 대한 S A B C D 무게변수 완성시키기
const add_sabcd = (k) =>{
    switch(k){
        case 83:
            S++;
            break;
        case 65:
            A++;
            break;
        case 66:
            B++;
            break;
        case 67:
            C++;
            break;
        case 68:
            D++;
            break;            
    };
                
};


const add2_synergy = (k) =>{
    if(k === 1){
        if(S >= 1 || A>=2){
            neutralization = '최상';
            return;
        }else if(A === 1 && B >=2){
            neutralization = '상';
            return;
        }else if(B >= 3){
            neutralization = '중상';
            return;
        }else if(B === 2 || C>=3 || (B ===1 && C >=2)){
            neutralization = '중';
            return;   
        }else if(A === 0 && B === 0 && C === 0 && D === 0){
            neutralization = '';
            return;
        }else{
            neutralization = '하';
            return;
        }                 
    }         
}


//정화 계산하기
const add_purification = (k)=>{
    if(k === 1){
        if(purification >= 1){
            purification = purification + '개';
            return;
        }else if(element_party1[0].value === ''){
            purification = null;
            return;
        }else{
            purification = 'X';
            return;
        }                
    }

    if(k === 2){
        if(purification >= 1){
            purification = purification + '개';
            return;
        }else if(element_party2[0].value === ''){
            purification = null;
            return;
        }else{
            purification = 'X';
            return;
        }   
    }
}    

//피감,쉴드 계산하기
const add_shield = (k)=>{
    if(k === 1){
        if(shield >= 1){
            shield = shield + '개';
            return;
        }else if(element_party1[0].value === ''){
            shield = null;
            return;
        }else{
            shield = 'X';
            return;
        }
    }

    if(k === 2){
        if(shield >= 1){
            shield = shield +'개';
            return;
        }else if(element_party2[0].value === ''){
            shield = null;
            return;
        }else{
            shield = 'X';
            return;
        }
    }
}


///// 직업별 시너지 DataBase
// 치명타, 공증/피증/방깍/백헤드 공이속 도출
const add_synergy = (k)=>{
    switch(k){
        case undefined:
            break;
        case '디스트로이어':
            ignore_defence_a *= 0.88; // 방깍 12%
            add_sabcd(83);
            break;
        case '워로드':
            ignore_defence_a *= 0.88; // 방깍 12%
            backHead_increase_m += 12;
            purification ++;
            shield++;
            add_sabcd(83);
            break;
        case '버서커':
            damage_increase_a += 6;
            add_sabcd(65);
            break;
        case '홀리나이트':
            damage_increase_a += 20;
            attack_increase_m += 6;
            attack_speed += 10;
            move_speed += 10;
            purification ++;
            shield++;
            add_sabcd(68);
            break;
        case '소서리스':
            damage_increase_a += 6;
            add_sabcd(67);
            break;
        case '아르카나':
            critical_increase_a += 10;
            add_sabcd(68);
            break;
        case '바드':
            damage_increase_a += 20;
            damage_increase_m += 15;
            attack_increase_m += 6;
            attack_speed += 10;
            move_speed += 10;
            shield++;
            add_sabcd(68);
            break;
        case '서머너':
            ignore_defence_a *= 0.88; // 방깍 12%
            add_sabcd(66);
            break;
        case '리퍼':
            ignore_defence_a *= 0.88; // 방깍 12%
            add_sabcd(68);
            break;
        case '블레이드':
            backHead_increase_a += 12;
            attack_speed_m += 25;
            move_speed_m += 19.8;
            add_sabcd(66);
            break;
        case '데모닉':
            damage_increase_a += 6;
            add_sabcd(67);
            break;
        case '스트라이커':
            critical_increase_m += 18;
            add_sabcd(67);
            break;
        case '인파이터':
            damage_increase_a += 6;
            add_sabcd(67);
            break;
        case '창술사':
            critical_increase_m += 18;
            add_sabcd(68);
            break;
        case '배틀마스터':
            critical_increase_m += 18;
            attack_speed_m += 8;
            move_speed_m += 16;
            add_sabcd(67);
            break;                       
        case '기공사':
            attack_increase_a += 6;
            purification ++;
            shield++;
            add_sabcd(67);
            break;
        case '데빌헌터':
            critical_increase_a += 10;
            add_sabcd(68);
            break;
        case '건슬링어':
            critical_increase_a += 10;
            add_sabcd(68);
            break;
        case '블래스터':
            ignore_defence_a *= 0.88; //방깍 12%
            add_sabcd(65);
            break;
        case '스카우터':
            attack_increase_a += 6;
            add_sabcd(65);
            break;
        case '호크아이':
            damage_increase_a += 6;
            add_sabcd(65);
            break;
        case '도화가':
            damage_increase_a += 20;
            attack_increase_m += 6;
            attack_speed += 10;
            move_speed += 10;
            purification ++;
            shield++;
            add_sabcd(68);
            break;
        case '기상술사':
            critical_increase_a += 10;
            move_speed_m += 12;
            attack_speed_m += 12;
            add_sabcd(66);
            shield++;
            break;                        
    };
    
}

const show_result = (a) =>{
    if(a === 1){
        ///상시, 순간
        cp_critical1.value = '+ ' + critical_increase_a + '% ' + ' ~ ' + (critical_increase_a +critical_increase_m) + '%';

        cp_damage1.value = 'A' + damage_increase_a + '   ' + 'M' + damage_increase_m;
        cp_attack1.value = 'A' + attack_increase_a + '   ' + 'M' + attack_increase_m;
        cp_backHead1.value = 'A' + backHead_increase_a + '   ' + 'M' + backHead_increase_m;
        cp_ignore1.value = 'A' + parseInt(100-ignore_defence_a) + '   ' + 'M' + parseInt(100-ignore_defence_m);
        cp_total_damage1.value = '+ ' + total_damage_increase_c + '%';
        ///
        cp_attack_speed1.value = '+ ' + attack_speed + '% ' + ' ~ ' + (attack_speed + attack_speed_m) + '%';
        cp_move_speed1.value = '+ ' + move_speed + '% ' + ' ~ ' + (move_speed + move_speed_m) + '%';

        cp_neutralization1.value = neutralization;
        cp_purification1.value = purification;
        cp_shield1.value = shield;

        cp_score1.value = synergy_score;
    };

    if(a === 2){
        ///상시, 순간
        cp_critical2.value = '+ ' + critical_increase_a + '% ' + ' ~ ' + (critical_increase_a +critical_increase_m) + '%';

        cp_damage2.value = 'A' + damage_increase_a + '   ' + 'M' + damage_increase_m;
        cp_attack2.value = 'A' + attack_increase_a + '   ' + 'M' + attack_increase_m;
        cp_backHead2.value = 'A' + backHead_increase_a + '   ' + 'M' + backHead_increase_m;
        cp_ignore2.value = 'A' + parseInt(100-ignore_defence_a) + '   ' + 'M' + parseInt(100-ignore_defence_m);
        cp_total_damage2.value = '+ ' + total_damage_increase_c + '%';
        ///
        cp_attack_speed2.value = '+ ' + attack_speed + '% ' + ' ~ ' + (attack_speed + attack_speed_m) + '%';
        cp_move_speed2.value = '+ ' + move_speed + '% ' + ' ~ ' + (move_speed + move_speed_m) + '%';

        cp_neutralization2.value = neutralization;
        cp_purification2.value = purification;
        cp_shield2.value = shield;

        cp_score2.value = synergy_score;

    };

    if(a === 3){
        const input_element1 = document.getElementsByClassName('result1_css');
        const input_element2 = document.getElementsByClassName('result2_css');
        for(let i = 0; i < 12; i++){
            input_element1[i].value = null;
            input_element2[i].value = null;
        }
    };
}


const clear = (a)=>{
    if(a === 1){
        ///상시, 순간
        critical_increase_a = 0;
        critical_increase_m = 0; 

        damage_increase_a = 0;
        damage_increase_m = 0; 
        attack_increase_a = 0; 
        attack_increase_m = 0;
        backHead_increase_a = 0;
        backHead_increase_m = 0;
        ignore_defence_a = 100;
        ignore_defence_m = 100;
        total_damage_increase_a = 0;
        total_damage_increase_m = 0;
        total_damage_increase_c = 0;//찐찐 토탈 평균 총 데미지 증가량 변수임
        ///
        attack_speed = 0;
        attack_speed_m = 0;
        move_speed = 0; 
        move_speed_m = 0;
        ///무력화 계수 초기화
        S = 0;
        A = 0;
        B = 0;
        C = 0;
        D = 0;
        ///

        neutralization = null; 
        purification = null; 
        shield = null; 

        synergy_score = null;    
    }
}


const cp_btn_result = document.querySelector('#btn_result');
cp_btn_result.addEventListener('click', ()=>{
    //1파티 픽스된 input 의 클래스에 각 요소들을 temp_arry1 에 저장후, 중복배열을 제거하여 new_element_party1 배열생성
    clear(1);
    let temp_arry1 = new Array();
    for(let i = 0; i < 4; i++){
        temp_arry1[i] = element_party1[i].value;
    }
    let new_element_party1 = [...new Set(temp_arry1)];
    
    for(let i = 0; i < 4; i++){
        add_synergy(new_element_party1[i]);
    }
    //총 데미지 증가율 계산
    total_damage_increase_a = damage_increase_a + attack_increase_a + backHead_increase_a + parseInt((100-ignore_defence_a)/2);              
    total_damage_increase_m = damage_increase_m + attack_increase_m + backHead_increase_m + parseInt((100-ignore_defence_m)/2);
    total_damage_increase_c = total_damage_increase_a + (total_damage_increase_m)/2;
    add2_synergy(1); //무력화 계산
    add_purification(1); // 정화계산
    add_shield(1); //쉴드,피감 계산
    show_result(1);
    clear(1); // 시너지 변수들 초기화. 2파티 시너지들을 추가하기 위해!
    
    let temp_arry2 = new Array();
    for(let i = 0; i < 4; i ++){
        temp_arry2[i] = element_party2[i].value;
        console.log(temp_arry2[i]);
    }
    let new_element_party2 = [...new Set(temp_arry2)];
    
    for(let i = 0; i < 4; i++){
        add_synergy(new_element_party2[i]);
    }
    total_damage_increase_a = damage_increase_a + attack_increase_a + backHead_increase_a + parseInt((100-ignore_defence_a)/2);              
    total_damage_increase_m = damage_increase_m + attack_increase_m + backHead_increase_m + parseInt((100-ignore_defence_m)/2);
    total_damage_increase_c = total_damage_increase_a + (total_damage_increase_m)/2;
    add2_synergy(1); //무력화 계산
    add_purification(2);//정화계산
    add_shield(2); //쉴드,피감 계산
    show_result(2);
    clear(1);          
});