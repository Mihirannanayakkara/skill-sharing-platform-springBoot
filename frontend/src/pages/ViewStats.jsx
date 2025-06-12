import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import CountUp from 'react-countup';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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

  // Stat card data with icons
  const statCards = [
    {
      title: 'Users',
      value: stats.totalUsers,
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
      ),
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      title: 'Courses',
      value: stats.totalCourses,
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
      ),
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Certifications',
      value: stats.totalCerts,
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
      ),
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      title: 'Learning Plans',
      value: stats.totalPlans,
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
      ),
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Posts',
      value: stats.totalPosts,
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
          </svg>
      ),
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
      <div className="space-y-8">
        {/* Page Header
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Platform Statistics</h1>
        <p className="text-gray-600 mt-1">View comprehensive analytics about your learning platform</p>
      </div> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card, idx) => (
              <div
                  key={idx}
                  className={`${card.bgColor} rounded-lg shadow-sm p-6 transition duration-300 hover:shadow-md`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <CountUp
                        end={card.value}
                        duration={2.5}
                        className={`text-3xl font-bold ${card.textColor} mt-1`}
                    />
                  </div>
                  <div className="rounded-full p-2 bg-white bg-opacity-80 shadow-sm">
                    {card.icon}
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 transition duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Content Comparison</h3>
                <p className="text-sm text-gray-500">Users vs Courses vs Posts</p>
              </div>
              <div className="p-1.5 bg-gray-100 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={[
                      {
                        name: 'Statistics',
                        Users: stats.totalUsers,
                        Courses: stats.totalCourses,
                        Posts: stats.totalPosts
                      }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none'
                      }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar dataKey="Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Courses" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Posts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 transition duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Certification Trends</h3>
                <p className="text-sm text-gray-500">Certifications issued over time</p>
              </div>
              <div className="p-1.5 bg-gray-100 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={stats.certsOverTime}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                      padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                  />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none'
                      }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 6, strokeWidth: 2, fill: '#ffffff' }}
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }}
                      name="Certifications"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 transition duration-300 hover:shadow-md mb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Course Level Distribution</h3>
              <p className="text-sm text-gray-500">Breakdown of course difficulty levels</p>
            </div>
            <div className="p-1.5 bg-gray-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="w-full md:w-2/3 h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                      data={stats.courseLevels}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      stroke="#ffffff"
                      strokeWidth={2}
                  >
                    {stats.courseLevels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none'
                      }}
                  />
                  <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      iconSize={10}
                      iconType="circle"
                      formatter={(value) => <span className="text-sm font-medium text-gray-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/3 mt-4 md:mt-0 ">
              <div className="grid grid-cols-1 gap-4">
                {stats.courseLevels.map((level, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{level.name}</p>
                        <p className="text-xs text-gray-500">{level.value} courses</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ViewStats;