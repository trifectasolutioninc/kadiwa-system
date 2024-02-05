import kadiwa_rice from '../Components/Assets/products/kadiwa-rice.png';
import corn_white from '../Components/Assets/products/corn-white.png';
import corn_yellow from '../Components/Assets/products/corn-yellow.png';
import tilapia from '../Components/Assets/products/tilapia.png';
import galunggonglocal from '../Components/Assets/products/galunggong-local.png';
import galunggongimported from '../Components/Assets/products/galunggong-imported.png';
import alumahan from '../Components/Assets/products/alumahan.png';
import beefrump from '../Components/Assets/products/beef-rump.png';
import beefbrisket from '../Components/Assets/products/beef-brisket.png';
import porkham from '../Components/Assets/products/pork-ham.png';
import porkbelly from '../Components/Assets/products/pork-belly.png';
import wholechicken from '../Components/Assets/products/whole-chicken.png';
import chickenegg from '../Components/Assets/products/chicken-egg.png';
import ampalaya from '../Components/Assets/products/ampalaya.png';
import stringbeans from '../Components/Assets/products/string-beans.png';
import petchaytagalog from '../Components/Assets/products/petchay-tagalog.png';
import squash from '../Components/Assets/products/squash.png';
import eggplant from '../Components/Assets/products/eggplant.png';
import tomato from '../Components/Assets/products/tomato.png';
import cabbagescorpio from '../Components/Assets/products/cabbage-scorpio.png';
import carrots from '../Components/Assets/products/carrots.png';
import habitchuelas from  '../Components/Assets/products/habitchuelas.png';
import whitepotato from '../Components/Assets/products/white-potato.png';
import petchaybaguio from '../Components/Assets/products/petchay-baguio.png';
import chayote from '../Components/Assets/products/chayote.png';
import rareball from '../Components/Assets/products/rare-ball.png';
import wonderball from '../Components/Assets/products/wonder-ball.png';
import redonionlocal from '../Components/Assets/products/redonion-local.png';
import redonionimported from  '../Components/Assets/products/redonion-imported.png';
import whiteonionlocal from  '../Components/Assets/products/whiteonion-local.png';
import whiteonionimported from '../Components/Assets/products/whiteonion-imported.png';
import garliclocal from  '../Components/Assets/products/garlic-local.png';
import garlicimported from '../Components/Assets/products/gralic-imported.png';
import ginger from  '../Components/Assets/products/ginger.png';
import chili from  '../Components/Assets/products/chili.png';
import calamansi from  '../Components/Assets/products/calamansi.png';
import bananalakatan from  '../Components/Assets/products/banana-lakatan.png';
import bananalatundan from  '../Components/Assets/products/banana-latundan.png';
import papaya from  '../Components/Assets/products/papaya.png';
import mangocarabao from  '../Components/Assets/products/mango-carabao.png';

import sugarrefined from '../Components/Assets/products/sugar-refined.png';
import sugarwashed from '../Components/Assets/products/sugar-washed.png';
import sugarbrown from '../Components/Assets/products/sugar-brown.png';
import palmoilml from '../Components/Assets/products/palmoilml.png';
import palmoilliter from '../Components/Assets/products/palmoilliter.png';
import coconutoilml from '../Components/Assets/products/coconutoilml.png';
import coconutoilliter from '../Components/Assets/products/coconutoilliter.png';

import CardBg from '../Components/Assets/others/card-bg.png';
import KadiwaLogo from '../Components/Assets/logo/kadiwa-logo.png';
import KadiwaText from '../Components/Assets/logo/kadiwa-text.png';

import MasterCard from '../Components/Assets/payment/mastercard.png';
import Bank from '../Components/Assets/payment/bank.png';
import Gcash from '../Components/Assets/payment/gcash.png';
import Maya from '../Components/Assets/payment/maya.png';
import Megapay from '../Components/Assets/payment/megapay.png';

import StoreBG from '../Components/Assets/others/store_bg.webp'

const paymentImg = {
    MasterCard : MasterCard,
    Bank : Bank,
    Gcash : Gcash,
    Maya : Maya,
    Megapay : Megapay,
}

const imageConfig = {
    //Logo
    DALogo: './src/assets/DA-logo.png',
    AppLogo: KadiwaLogo,
    KadiwaText: KadiwaText,
    KadiwaTopLogo: './src/assets/logo/kadiwa-top-logo.png',
    EntranceBG: './src/assets/raw/entrance-bg.jpg',
    KadiwaText2: '../logo/kadiwa-text.png',
    //Banners
    BannerV1: '../banner/banner-v1.png',
    BannerV2: '../banner/banner-v2.png',
    BannerV3: '../banner/banner-v2.png',
    //Card
    cardbg: CardBg,
    AppLogoCard: '../logo/kadiwa-logo.png',
    //Products
    kadiwarice: kadiwa_rice,

    cornwhite: corn_white,
    cornyellow: corn_yellow,

    tilapia: tilapia,
    galunggonglocal: galunggonglocal,
    galunggongimported: galunggongimported,
    alumahan: alumahan,

    beefrump: beefrump,
    beefbrisket: beefbrisket,
    porkham: porkham,
    porkbelly: porkbelly,
    wholechicken: wholechicken,
    chickenegg: chickenegg,


    ampalaya: ampalaya,
    stringbeans: stringbeans,
    petchaytagalog: petchaytagalog,
    squash: squash,
    eggplant: eggplant,
    tomato: tomato,
    cabbagescorpio: cabbagescorpio,
    carrots: carrots,
    habitchuelas: habitchuelas,
    whitepotato: whitepotato,
    petchaybaguio: petchaybaguio,
    chayote: chayote,
    rareball: rareball,
    wonderball: wonderball,

    redonionlocal: redonionlocal,
    redonionimported:  redonionimported,
    whiteonionlocal:  whiteonionlocal,
    whiteonionimported:  whiteonionimported,
    garliclocal:  garliclocal,
    garlicimported:  garlicimported,
    ginger:  ginger,
    chili:  chili,

    calamansi:  calamansi,
    bananalakatan:  bananalakatan,
    bananalatundan:  bananalatundan,
    papaya:  papaya,
    mangocarabao:  mangocarabao,

    sugarrefined: sugarrefined,
    sugarwashed: sugarwashed,
    sugarbrown: sugarbrown,
    palmoilml: palmoilml,
    palmoilliter: palmoilliter,
    coconutoilml: coconutoilml,
    coconutoilliter: coconutoilliter,



    StoreBG: StoreBG,
    
    //Profile
    avataricon: '../profile/avatar-icon.png',
    //Cart
    cart1: '../cart/red-onion.png',
    cart2: '../cart/sugar-refine.png',
    cart3: '../cart/whole-chiken.png',
    //Shop
    shop1: '../shop/birdpoultryfarm.png',
    shop2: '../shop/blue sea fish.png',
    shop3: '../shop/indian rice.png',
    shop4: '../shop/sarisaristore.png',
    shop5: '../shop/turkeypoultrycity.png',

};

const styleConfig = {
    EntranceGradient: `linear-gradient(to top, #20802F 8%, #3AB64E14 100%)`,
};

const commodityTypes = [
    "All Commodities",
    "Rice",
    "Corn",
    "Fish",
    "Live Stock and Poultry Products",
    "Vegetables",
    "Spices",
    "Fruits",
    "Other Basic Commodities"
];


export { imageConfig, styleConfig, commodityTypes, paymentImg };
