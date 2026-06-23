(function () {
  function resolveCourseId() {
    var explicit = document.body ? document.body.getAttribute('data-course-id') : null;
    if (explicit) return explicit;
    var file = (window.location.pathname.split('/').pop() || '').toLowerCase();
    if (file.indexOf('fullstack-') === 0 || file === 'fullstack-dashboard.html') return 'fullstack-mern-001';
    if (file.indexOf('course-module-') === 0 || file === 'course-dashboard.html') return 'digital-marketing-001';
    return null;
  }

  function requireCourseAuth() {
    var courseId = resolveCourseId();
    if (!courseId) return;

    var token = localStorage.getItem('studentToken');
    var enrolledCourses = [];
    try {
      enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    } catch (_err) {
      enrolledCourses = [];
    }

    var hasCourse = enrolledCourses.some(function (course) {
      return course && course.courseId === courseId;
    });

    if (!token || !hasCourse) {
      window.location.replace('student-login.html?course=' + encodeURIComponent(courseId));
      return;
    }

    localStorage.setItem('ACTIVE_ENROLLMENT_COURSE', courseId);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', requireCourseAuth);
  } else {
    requireCourseAuth();
  }
})();
