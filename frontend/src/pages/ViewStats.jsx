import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import CountUp from 'react-countup';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const ViewStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalCerts: 0,
    totalPlans: 0,
    totalPosts: 0,
    certsOverTime: [],
    courseLevels: []
  });

  const fetchStats = async () => {
    try {
      const [userRes, courseRes, certRes, planRes, postRes, skillRes] = await Promise.all([
        fetch('http://localhost:8070/api/user/all'),
        fetch('http://localhost:8070/api/dsrcourses'),
        fetch('http://localhost:8070/api/certifications/all'),
        fetch('http://localhost:8070/api/learningplans/all'),
        fetch('http://localhost:8070/api/media/getAll'),
        fetch('http://localhost:8070/api/skills/all')
      ]);

      const users = await userRes.json();
      const courses = await courseRes.json();
      const certs = await certRes.json();
      const plans = await planRes.json();
      const posts = await postRes.json();
      const skills = await skillRes.json();

      // Certifications over time (group by Month)
      const monthCertCount = {};
      certs.forEach(cert => {
        if (cert.issueDate) {
          const date = new Date(cert.issueDate);
          const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          monthCertCount[month] = (monthCertCount[month] || 0) + 1;
        }
      });
      const certsOverTime = Object.entries(monthCertCount).map(([month, count]) => ({ month, count }));

      // Course Level Distribution
      const levelCounts = { Beginner: 0, Intermediate: 0, Advanced: 0 };
      courses.forEach(course => {
        if (course.skillLevel) {
          levelCounts[course.skillLevel] = (levelCounts[course.skillLevel] || 0) + 1;
        }
      });
      const courseLevels = Object.keys(levelCounts).map(level => ({ name: level, value: levelCounts[level] }));

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalCerts: certs.length,
        totalPlans: plans.length,
        totalPosts: posts.length,
        certsOverTime,
        courseLevels
      });

    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-10">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        {[
          { title: 'Users', value: stats.totalUsers },
          { title: 'Courses', value: stats.totalCourses },
          { title: 'Certifications', value: stats.totalCerts },
          { title: 'Learning Plans', value: stats.totalPlans },
          { title: 'Posts', value: stats.totalPosts }
        ].map((card, idx) => (
          <div key={idx} className="bg-white shadow rounded p-4 flex flex-col items-center">
            <h2 className="text-xl font-bold">{card.title}</h2>
            <CountUp end={card.value} duration={2} className="text-3xl font-bold text-blue-600 mt-2" />
          </div>
        ))}
      </div>

      {/* Side-by-Side Bar Chart + Line Chart */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Bar Chart */}
        <div className="bg-white shadow rounded p-4 flex-1">
          <h3 className="text-lg font-semibold mb-4">Users vs Courses vs Posts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              {
                name: 'Statistics',
                Users: stats.totalUsers,
                Courses: stats.totalCourses,
                Posts: stats.totalPosts
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Users" fill="#8884d8" />
              <Bar dataKey="Courses" fill="#82ca9d" />
              <Bar dataKey="Posts" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow rounded p-4 flex-1">
          <h3 className="text-lg font-semibold mb-4">Certifications Issued Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.certsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Course Level Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={stats.courseLevels} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {stats.courseLevels.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ViewStats;
