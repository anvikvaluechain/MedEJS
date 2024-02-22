const { Course, User } = require("./db");
const { JWT_SECRET } = require('./config');
const mongoose = require('mongoose');
const isAuthenticated = require('./isAuthenticatedMiddleware');
const checkUploadedDocuments = require('./checkUploadedFiles');
const checkUserLoggedIn = require('./authMiddleware');
function setRoutes(app) {
  app.use((req, res, next) => {
    if (req.headers.host === 'globalmedacademy.com') {
      return res.redirect(301, `https://www.globalmedacademy.com${req.originalUrl}`);
    }
    next();
  });

  app.get("/", checkUserLoggedIn, function (req, res) {
    const pageTitle = 'Fellowship Course, Online Medical Certificate Courses - GlobalMedAcademy';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'certificate courses online, fellowship course, fellowship course details, fellowship in diabetology, critical care medicine, internal medicine ';
    const ogDescription = 'GlobalMedAcademy is a healthcare EdTech company. We provide various blended learning medical fellowship, certificate courses, and diplomas for medical professionals';
    const canonicalLink = 'https://www.globalmedacademy.com/';

    if (req.isUserLoggedIn) {
      // Split the full name and take the first part (first name)
      const firstName = req.user.fullname.split(' ')[0];

      // Render the authenticated view and pass necessary variables
      res.render('index', {
        pageTitle,
        metaRobots,
        metaKeywords,
        ogDescription,
        canonicalLink,
        username: req.user.username,
        firstname: firstName, // Pass the first name instead of the full name
        isBlogPage: false,
        isUserLoggedIn: true
      });
    } else {
      // Render the non-authenticated view and pass necessary variables
      res.render('index', {
        pageTitle,
        metaRobots,
        metaKeywords,
        ogDescription,
        canonicalLink,
        isBlogPage: false,
        isUserLoggedIn: false
      });
    }
  });

  function checkEmailVerified(req, res, next) {
    // Check if the user is on the auth_email page and hasn't authorized their email
    if (req.path === '/auth_email' && !req.session.emailVerified) {
      // If not authorized, redirect to the register page
      res.redirect('/register');
    } else {
      // If email is verified or user is not on auth_email, proceed to the next middleware/route
      next();
    }
  }


  app.get("/data", (req, res) => {
    res.render("data");
  })
  app.get("/course-masonry", async function (req, res) {
    const pageTitle = 'Professional, Advanced, Fellowship courses';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'small courses view, view all courses, course listings, online course catalog, course directory, course offerings, course categories, course search, explore courses, browse courses online medical instructor, medical teacher, apply for medical instructor';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/course-masonry';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-masonry', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });

  });

  app.get("/auth_index", function (req, res) {
    res.render("auth_index");
  });

  app.get("/become-teacher", function (req, res) {
    const pageTitle = 'Become a Mentor/Instructor';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'medical instructor, medical teacher, apply for medical instructor';
    const ogDescription = 'Medical Academic Instructor - Apply for medical teacher and shine your career with us.';
    const canonicalLink = 'https://www.globalmedacademy.com/become-teacher';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('becometeacher', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/user-interest-form", function (req, res) {
    const pageTitle = 'Be a part of GlobalMed Academy';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'medical instructor, medical teacher, apply for medical instructor';
    const ogDescription = 'Medical Academic Instructor - Apply for medical teacher and shine your career with us.';
    const canonicalLink = 'https://www.globalmedacademy.com/user-interest-form';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('user-interest-form', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/refer-and-earn", isAuthenticated, function (req, res) {
    const pageTitle = 'Refer and Earn';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/refer-and-earn';
    const username = req.session.username || null;
    let firstname = null;

    if (req.isUserLoggedIn && req.user && req.user.fullname) {
        firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }

    if (req.isUserLoggedIn) {
        try {
            res.render('refer-and-earn', {
                pageTitle,
                metaRobots,
                metaKeywords,
                ogDescription,
                canonicalLink,
                isUserLoggedIn: req.isUserLoggedIn,
                username: username,
                isBlogPage: false,
                firstname: firstname
            });
        } catch (error) {
            console.error('Error in refer-and-earn route:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        req.flash('loginMessage', 'Please log in to refer others and earn rewards.');
        res.redirect('/loginn');
    }
});


  app.get("/privacy-policy", function (req, res) {
    const pageTitle = 'Privacy Policy - GlobalMedAcademy';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = 'If you have any queries, read our privacy policy and terms and conditions carefully.';
    const canonicalLink = 'https://www.globalmedacademy.com/privacy-policy';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('privacy-policy', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  // app.get('/paymentForm',function(req,res){
  //   const pageTitle = 'Admission Guide - GlobalMedAcademy';
  //   const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
  //   const metaKeywords = '';
  //   const ogDescription = '';
  //   const canonicalLink = 'https://globalmedacademy.com/admission-guide';
  //   const username = req.session.username || null;
  //   res.render('paymentForm', { pageTitle, metaRobots, metaKeywords, ogDescription,canonicalLink,isUserLoggedIn: req.isUserLoggedIn,
  //     username: username  });
  //  });
  app.get("/terms-conditions", function (req, res) {
    const pageTitle = 'Terms and Conditions - GlobalMedAcademy';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = 'Before inquiring about our courses then read our T&C. If you have any queries terms and conditions carefully.';
    const canonicalLink = 'https://www.globalmedacademy.com/terms-conditions';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('terms-conditions', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/admission-guide", function (req, res) {
    const pageTitle = 'Admission Guide - GlobalMedAcademy';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/admission-guide';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('admission-guide', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });

  app.get("/course-details-fellowship-in-internal-medicine", function (req, res) {
    const pageTitle = 'Fellowship in Internal Medicine Program, Internal Medicine Online';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'fellowship in internal medicine, internal medicine subspecialty, fellowship in general medicine, fellowships of internal medicine, online internal medicine fellowship, fellowship in internal medicine program, general medicine fellowship';
    const ogDescription = 'Internal medicine fellowship help you to become a board-certified subspecialist. Join our fellowship programs and learn more with CPD standards certified course.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-fellowship-in-internal-medicine';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-fellowship-in-internal-medicine', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-fellowship-in-diabetes-management", function (req, res) {
    const pageTitle = 'Fellowship in Diabetes Mellitus Online, Fellowship Courses Diabetology';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'fellowship in diabetology, fellowship in diabetes, fellowship in diabetes mellitus, diabetes fellowship online, diabetes fellowship courses, fellowship in diabetology online, diabetology fellowship online, online fellowship in diabetology, diabetes fellowship for family physician, diabetes fellowship for primary care physicians, diabetes fellowship program, online diabetology fellowship, fellowship in diabetes management program';
    const ogDescription = 'Fellowship in Diabetes Mellitus involves training on comprehensive management of Diabetes Mellitus. Boost your career goal by gaining expertise in diabetology.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-fellowship-in-diabetes-management';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-fellowship-in-diabetes-management', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-fellowship-in-integrated-diabetes-management", function (req, res) {
    const pageTitle = 'Fellowship in Integrated Diabetes Management, Fellowship Courses Diabetology';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'fellowship in integrated diabetes, fellowships in integrated diabetes management,  diabetes management fellowship online, diabetes fellowship courses, fellowship in diabetology online, diabetology fellowship online, online fellowship in diabetology';
    const ogDescription = 'Fellowship in Integrated Management of Diabetes. Program empowers healthcare professionals with the essential skills and knowledge to comprehensively manage diabetes.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-fellowship-in-integrated-diabetes-management';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-fellowship-in-integrated-diabetes-management', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-fellowship-in-critical-care", function (req, res) {
    const pageTitle = 'Fellowship in Critical Care, Intensive Care, Internal Medicine Programs';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'fellowship in critical care, critical care medicine fellowship, fellowship in intensive care medicine, fellowship in critical care medicine online, critical care internal medicine, critical care medicine fellowship programs';
    const ogDescription = 'Fellowship in Critical Care Medicine Programs - Gain expertise with fellowship critical care medicine. Fellowship act as suppliment for students after the medical degree.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-fellowship-in-critical-care';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-fellowship-in-critical-care', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-advanced-professional-certificate-in-critical-care", function (req, res) {
    const pageTitle = 'Advanced Certificate in Critical Care Medicine, Intesive Care';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'emergency medical technician course, diploma in critical care medicine, advanced diploma in critical care, certificate in emergency medicine, advance diploma in critical care, advanced certificate in critical care medicine, certificate course in critical care medicine, certificate in critical care medicine, diploma in critical care after mbbs, emergency certificate medical, advanced certificate in critical care nursing, advanced certificate in neonatal critical care, advanced diploma in critical care nursing, advanced diploma in nursing critical care, certificate in critical care, certified critical care paramedic, critical care certificate program, diploma in intensive care medicine, pediatric critical care certification';
    const ogDescription = 'Advanced Certificate in Critical Care Medicine is designed to provide healthcare professionals with advanced knowledge and skills in the field of critical care.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-advanced-professional-certificate-in-critical-care';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-advanced-professional-certificate-in-critical-care', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-professional-certificate-in-diabetes-management", function (req, res) {
    const pageTitle = 'Professional Diabetes Certificate Course, Diabetology Online Programs';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'diabetes management, diabetes certificate course, certificate course in diabetology, certificate in diabetes, diabetes certificate course online, certificate course in diabetes management, advanced certificate course in diabetes, certificate in diabetes management, certificate in diabetes mellitus, certificate in diabetology, advanced certificate in diabetes mellitus, advanced diabetes management, certificate course in diabetes mellitus, diabetes certificate program online';
    const ogDescription = 'Professional Diabetes Certificate Course - Join online diabetes certificate course & equips healthcare professionals with the necessary skills and knowledge';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-professional-certificate-in-diabetes-management';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-professional-certificate-in-diabetes-management', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-advanced-professional-certificate-in-diabetes-management", function (req, res) {
    const pageTitle = 'Advanced Certificate in Diabetes Mellitus, Diabetology Online';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'diabetes management, diabetes certificate course, certificate course in diabetology, certificate in diabetes, diabetes certificate course online, certificate course in diabetes management, advanced certificate course in diabetes, certificate in diabetes management, certificate in diabetes mellitus, certificate in diabetology, advanced certificate in diabetes mellitus, advanced diabetes management, certificate course in diabetes mellitus, diabetes certificate program online';
    const ogDescription = 'Advanced Certificate in Diabetes Mellitus is designed by leading diabetologists to cover the clinical features, screening & diagnosis etc to help you.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-advanced-professional-certificate-in-diabetes-management';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-advanced-professional-certificate-in-diabetes-management', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-professional-certificate-in-general-practice", function (req, res) {
    const pageTitle = 'Professional Certificate in General Practice';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'diabetes management, diabetes certificate course, certificate course in diabetology, certificate in diabetes, diabetes certificate course online, certificate course in diabetes management, advanced certificate course in diabetes, certificate in diabetes management, certificate in diabetes mellitus, certificate in diabetology, advanced certificate in diabetes mellitus, advanced diabetes management, certificate course in diabetes mellitus, diabetes certificate program online';
    const ogDescription = 'Advanced Certificate in Diabetes Mellitus is designed by leading diabetologists to cover the clinical features, screening & diagnosis etc to help you.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-professional-certificate-in-general-practice';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-professional-certificate-in-general-practice', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-fellowship-in-general-practice", function (req, res) {
    const pageTitle = 'Fellowship in General Practice, Online Course, After MBBS';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'fellowship in general practice, online fellowship in general practice';
    const ogDescription = "Fellowship in General Practice to meet the pressing demand for specialized medical training in India's intricate healthcare landscape";
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-fellowship-in-general-practice';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-fellowship-in-general-practice', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-advanced-professional-certificate-in-general-practice", function (req, res) {
    const pageTitle = 'Advanced Professional Certificate in General Practice';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'diabetes management, diabetes certificate course, certificate course in diabetology, certificate in diabetes, diabetes certificate course online, certificate course in diabetes management, advanced certificate course in diabetes, certificate in diabetes management, certificate in diabetes mellitus, certificate in diabetology, advanced certificate in diabetes mellitus, advanced diabetes management, certificate course in diabetes mellitus, diabetes certificate program online';
    const ogDescription = 'Advanced Certificate in Diabetes Mellitus is designed by leading diabetologists to cover the clinical features, screening & diagnosis etc to help you.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-advanced-professional-certificate-in-general-practice';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-advanced-professional-certificate-in-general-practice', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-professional-certificate-in-critical-care", function (req, res) {
    const pageTitle = 'Professional Certificate Course in Critical Care Medicine Program';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'professional certificate in emergency medicine, certificate course in critical care medicine, professional certificate in critical care medicine, professional certificate in critical care, professional critical care certificate program';
    const ogDescription = 'Professional Certificate Course in Critical Care Medicine is proposed to impart structured critical care training to MBBS doctors to improve patient management skills.';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-professional-certificate-in-critical-care';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-professional-certificate-in-critical-care', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });

  app.get("/course-details-anaphylaxis", function (req, res) {
    const pageTitle = 'Anaphylaxis';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-anaphylaxis';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-anaphylaxis', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-blood-transfusion", function (req, res) {
    const pageTitle = 'Blood Transfusion';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-blood-transfusion';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-blood-transfusion', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-allied-health-professionals-in-neonatal-care", function (req, res) {
    const pageTitle = 'Allied Health Professionals in Neonatal Care';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-allied-health-professionals-in-neonatal-care';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-allied-health-professionals-in-neonatal-care', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-acute-medicine", function (req, res) {
    const pageTitle = 'Acute Medicine';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-acute-medicine';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-acute-medicine', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-breast-imaging", function (req, res) {
    const pageTitle = 'Breast Imaging';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/course-details-breast-imaging';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('course-details-breast-imaging', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/ayush-course/cancer-careers-in-nursing-elearning-course", function (req, res) {
    const pageTitle = 'Breast Imaging';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/ayush-course/cancer-careers-in-nursing-elearning-course';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('ayush-course/cancer-careers-in-nursing-elearning-course', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/ayush-course/course-details-cardiovascular-disease-toolkit", function (req, res) {
    const pageTitle = 'Cardiovascular Disease Toolkit';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/ayush-course/course-details-cardiovascular-disease-toolkit';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('ayush-course/course-details-cardiovascular-disease-toolkit', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/ayush-course/course-details-care-certificate", function (req, res) {
    const pageTitle = 'Care Certificate';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/ayush-course/course-details-care-certificate';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('ayush-course/course-details-care-certificate', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/ayush-course/course-details-breastmilk-provison-for-preterm-and-sick-neonates", function (req, res) {
    const pageTitle = 'Breastmilk Provision for Preterm and Sick Neonates';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/ayush-course/course-details-breastmilk-provison-for-preterm-and-sick-neonates';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('ayush-course/course-details-breastmilk-provison-for-preterm-and-sick-neonates', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/user-form", function (req, res) {
    const pageTitle = 'New User Registration';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/user-form';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('user-form', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/course-details-obsgynae", function (req, res) {
    res.render("course-details-obsgynae");
  });
  app.get("/about-us", function (req, res) {
    const pageTitle = 'About Fellowship, Ceritifcate Courses Online - GlobalMedAcademy';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'certificate courses online, fellowship course, fellowship course details, fellowship in diabetology, critical care medicine, internal medicine';
    const ogDescription = 'GlobalMedAcademy (GMA) is a cutting-edge Medical Ed-tech organization that provides specialized courses for medical graduates through hybrid learning approach.';
    const canonicalLink = 'https://www.globalmedacademy.com/about-us';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('about-us', {
      pageTitle,
      metaRobots,
      metaKeywords,
      ogDescription,
      canonicalLink,
      isUserLoggedIn: req.isUserLoggedIn,
      username: username,
      isBlogPage: false,
      firstname: firstname
    });
  })
  app.get("/404", function (req, res) {
    const pageTitle = 'Course launching soon !';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'mall courses view, view all courses, course listings, online course catalog, course directory, course offerings, course categories, course search, explore courses, browse courses onlineedical instructor, medical teacher, apply for medical instructor';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/faqs';
    res.render('404', { pageTitle, metaRobots, metaKeywords, ogDescription })
  });
  app.get("/verify-certificate", function (req, res) {
    const pageTitle = 'Verify-certificate';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'mall courses view, view all courses, course listings, online course catalog, course directory, course offerings, course categories, course search, explore courses, browse courses onlineedical instructor, medical teacher, apply for medical instructor';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/verify-certificate';
    const username = req.session.username || null
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('verify-certificate', { pageTitle, metaRobots, metaKeywords, ogDescription, isUserLoggedIn: req.isUserLoggedIn, isBlogPage: false, canonicalLink, username: username, firstname: firstname })
  });
  app.get("/auth_email", function (req, res) {
    const pageTitle = 'Authorize your Email';
    const metaRobots = '';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/auth_email';
    res.render('auth_email', { pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isBlogPage: false });
  });
  app.get("/faqs", function (req, res) {
    const pageTitle = 'Frequently Ask Question About Fellowship & Certificate Program';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'Fellowship & Certificate Faqs';
    const ogDescription = 'Ask your question regarding our fellowship and certificate programs from our experts.';
    const canonicalLink = 'https://www.globalmedacademy.com/faqs';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn) {
      firstname = req.session.username ? req.session.username.split(' ')[0] : null;
    }
    res.render('faqs', {
      isUserLoggedIn: req.isUserLoggedIn, pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/blogs", function (req, res) {
    const pageTitle = 'Blogs';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'Fellowship & Certificate Faqs';
    const ogDescription = 'Blogs';
    const canonicalLink = 'https://www.globalmedacademy.com/blogs';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }
    res.render('blogs', {
      pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isUserLoggedIn: req.isUserLoggedIn,
      username: username, isBlogPage: false, firstname: firstname
    });
  });
  app.get("/blog/:blogTitle", function (req, res) {
    const blogTitle = req.params.blogTitle;
    let pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, renderView;
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn && req.user && req.user.fullname) {
      firstname = req.user.fullname.split(' ')[0]; // Extract the first name from the full name
    }

    // Existing blog about Diabetes Mellitus
    if (blogTitle === "elevate-your-expertise-in-diabetes-care-join-our-fellowship-to-lead-the-fight-against-diabetes-mellitus") {
      pageTitle = 'Elevate Your Expertise in Diabetes Care: Join Our Fellowship to Lead the Fight Against Diabetes Mellitus';
      metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
      metaKeywords = 'Fellowship in diabetology, fellowship in diabetes, fellowship in diabetes mellitus, diabetes fellowship online, diabetes fellowship courses, fellowship in diabetology online';
      ogDescription = 'Blogs';
      canonicalLink = 'https://www.globalmedacademy.com/blog/elevate-your-expertise-in-diabetes-care-join-our-fellowship-to-lead-the-fight-against-diabetes-mellitus';
      renderView = 'blog-details';
    }
    // New blog about Internal Medicine
    else if (blogTitle === "pursuing-excellence-a-comprehensive-overview-of-a-fellowship-in-internal-medicine") {
      pageTitle = 'Pursuing Excellence: A Comprehensive Overview of a Fellowship in Internal Medicine';
      metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
      metaKeywords = 'Fellowship in Internal Medicine, Fellowship in General Practice, General Practice, Internal Medicine';
      ogDescription = 'Explore the benefits and intricacies of pursuing a Fellowship in Internal Medicine/ General Practice.';
      canonicalLink = 'https://www.globalmedacademy.com/blog/pursuing-excellence-a-comprehensive-overview-of-a-fellowship-in-internal-medicine';
      renderView = 'blog-details-2';
    }
    else if (blogTitle === "advanced-professional-certificate-in-diabetes-mellitus-enhancing-expertise-in-diabetes-management") {
      pageTitle = 'Advanced Professional Certificate in Diabetes Mellitus: Enhancing Expertise in Diabetes Management';
      metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
      metaKeywords = 'Diabetes Mellitus, Diabetes Management, Advanced Certificate, Diabetes Mellitus Expertise';
      ogDescription = 'Enhance your expertise in diabetes management with our Advanced Professional Certificate in Diabetes Mellitus.';
      canonicalLink = 'https://www.globalmedacademy.com/blog/advanced-professional-certificate-in-diabetes-mellitus-enhancing-expertise-in-diabetes-management';
      renderView = 'blog-details-3'; // Create a new view for this blog post
    }
    else if (blogTitle === "empower-your-expertise-in-professional-certificate-in-diabetes-mellitus-transforming-care-for-a-healthier-tomorrow") {
      pageTitle = 'Exploring the Future of Medical Research';
      metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
      metaKeywords = 'Medical Research, Future of Medicine, Medical Innovations';
      ogDescription = 'Dive deep into the advancements and potential of future medical research.';
      canonicalLink = 'https://www.globalmedacademy.com/blog/empower-your-expertise-in-professional-certificate-in-diabetes-mellitus-transforming-care-for-a-healthier-tomorrow';
      renderView = 'blog-details-4'; // Assuming you'll create a new view for this blog post
    }
  
    // Check to ensure we have pageTitle (and by extension, the other meta data),
    // which ensures the blogTitle provided in the URL is valid.
    if (pageTitle) {
      res.render(renderView, {
        pageTitle,
        metaRobots,
        metaKeywords,
        ogDescription,
        canonicalLink,
        isUserLoggedIn: req.isUserLoggedIn,
        username: username,
        isBlogPage: true,
        firstname: firstname
      });
    } else {
      // Optionally handle the case where a blog of the provided title doesn't exist. E.g.:
      res.status(404).send("Blog not found!");
    }
  });



  app.get("/loginn", function (req, res) {
    const pageTitle = 'Login';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/loginn';
    const loginMessage = req.flash('loginMessage');
    const messages = req.flash('loginMessage');
    const promptLogin = req.query.promptLogin;
    res.render('loginn', {
      pageTitle,
      metaRobots,
      metaKeywords,
      ogDescription,
      canonicalLink,
      isBlogPage: false,
      loginMessage: loginMessage[0],
      messages: messages,
      promptLogin: promptLogin 
      
    });
  });
  app.get("/forgot-password", function (req, res) {
    const pageTitle = 'Reset your password';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/forgot-password';
    res.render('forgot_password', {
      pageTitle,
      metaRobots,
      metaKeywords,
      ogDescription,
      canonicalLink,
      isBlogPage: false,
    });
  });
// GET route to render the password reset form
app.get('/reset-password/:token', async (req, res) => {
  const pageTitle = 'Reset your password';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/forgot-password';
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', decoded);
    const user = await User.findOne({
      _id: decoded._id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      console.log('No user found or token expired for user ID:', decoded._id);
      return res.status(400).send('Password reset token is invalid or has expired.');
    }
    // Render the reset password form
    res.render('reset_password', { token, pageTitle,
      metaRobots,
      metaKeywords,
      ogDescription,
      canonicalLink,
      isBlogPage: false, });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(400).send('Invalid token.');
  }
});
  app.get("/register", function (req, res) {
    // const email=req.body.email
    const pageTitle = 'Registration!';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = '';
    const canonicalLink = 'https://www.globalmedacademy.com/register';
    res.render('login', { pageTitle, metaRobots, metaKeywords, ogDescription, canonicalLink, isBlogPage: false });
  });
  app.get('/checkout/:courseID', isAuthenticated, async (req, res) => {
    const courseID = req.params.courseID;
    const pageTitle = 'Checkout - GlobalMedAcademy';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = 'checkout, payment, course payment';
    const ogDescription = 'Checkout page for GlobalMedAcademy courses.';
    const canonicalLink = 'https://globalmedacademy.com/checkout';
    const username = req.session.username || null;
    let firstname = null;
    if (req.isUserLoggedIn) {
      firstname = req.session.username ? req.session.username.split(' ')[0] : null;
    }

    if (req.isUserLoggedIn) {
      try {
        res.render('checkout', {
          pageTitle,
          metaRobots,
          metaKeywords,
          ogDescription,
          canonicalLink,
          isUserLoggedIn: req.isUserLoggedIn,
          username: username,
          courseID: courseID,
          isBlogPage: false,
          firstname: firstname
        });
      } catch (error) {
        console.error('Error in checkout route:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.redirect('/loginn');
    }
  });
  app.get("/admin-login", function (req, res) {
    const pageTitle = 'Admin Panel - GlobalMedAcademy';
    const metaRobots = 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
    const metaKeywords = '';
    const ogDescription = ''
    res.render('admin-login', {
      pageTitle, metaRobots, metaKeywords, ogDescription
    });
  });

  app.get("/becometeacher", (req, res) => {
    res.redirect(301, "/become-teacher");
  });

  app.get("/course-details-advanceddiabetesmellitus", (req, res) => {
    res.redirect(301, "/course-details-advanced-professional-certificate-in-diabetes-management");
  });

  app.get("/course-details-apcc", (req, res) => {
    res.redirect(301, "/course-details-advanced-professional-certificate-in-critical-care");
  });

  app.get("/course-details-fcc", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-critical-care");
  });

  app.get("/course-details-fellowshipindiabetesmellitus", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-diabetes-management");
  });

  app.get("/course-details-fellowshipininternalmedicine", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-internal-medicine");
  });

  app.get("/course-details-professionalcriticalcare", (req, res) => {
    res.redirect(301, "/course-details-professional-certificate-in-critical-care");
  });

  app.get("/course-details-professionaldiabetesmellitus", (req, res) => {
    res.redirect(301, "/course-details-professional-certificate-in-diabetes-management");
  });

  app.get("/aboutus", (req, res) => {
    res.redirect(301, "/about-us");
  });

  app.get("/course-details-obsgynae", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-obsgynae");
  });
  app.get("/.html", (req, res) => {
    res.redirect(301, "/");
  });

  app.get("/verify-otp", (req, res) => {
    res.redirect(301, "/");
  });

  app.get("/send-otp", (req, res) => {
    res.redirect(301, "/");
  });

  app.get("/instructor-wishlist.html", (req, res) => {
    res.redirect(301, "/");
  });

  app.get("/course-details-fellowship-in-diabetes-mellitus", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-diabetes-management");
  });

  app.get("/course-details-fellowship-in-obsgynae", (req, res) => {
    res.redirect(301, "/");
  });

  app.get("/index-2.html", (req, res) => {
    res.redirect(301, "/");
  });

  // app.get("/:search_term_string", (req, res) => {
  //   res.redirect(301, "/");
  // });

  app.get("/course-details-fpd", (req, res) => {
    res.redirect(301, "/");
  });

  app.get("/course-card-3.html", (req, res) => {
    res.redirect(301, "/");
  });

  app.get("/course-details-fcc", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-critical-care");
  });

  app.get("/course-details-advanceddiabetesmellitus", (req, res) => {
    res.redirect(301, "/course-details-advanced-professional-certificate-in-diabetes-management");
  });

  app.get("/terms-conditions", (req, res) => {
    res.redirect(301, "/terms-conditions");
  });

  app.get("/course-details-fellowshipincriticalcare", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-critical-care");
  });

  app.get("/course-details-professionaldiabetesmellitus", (req, res) => {
    res.redirect(301, "/course-details-professional-certificate-in-diabetes-management");
  });

  app.get("/course-details-obsgynae", (req, res) => {
    res.redirect(301, "/");
  });

  app.get("/course-details-fellowshipindiabetesmellitus", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-diabetes-management");
  });

  app.get("/course-details-fellowshipininternalmedicine", (req, res) => {
    res.redirect(301, "/course-details-fellowship-in-internal-medicine");
  });

  app.get("/course-details", (req, res) => {
    res.redirect(301, "/course-masonry");
  });
  app.get("/about.html", (req, res) => {
    res.redirect(301, "/about-us")
  });
  app.get("/admin",(req,res)=>{
    res.redirect("admin-login")
  })
  // app.get("*", function(req, res) {
  //   res.redirect(301,"/");
  // });
}


module.exports = setRoutes;
