// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Only POST requests allowed' });
//   }

//   const { filename, content } = req.body;

//   const response = await fetch(`https://api.github.com/repos/netizens-vruti/agt/contents/${filename}`, {
//     method: 'PUT',
//     headers: {
//       'Authorization': `token ${process.env.GITHUB_TOKEN}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       message: `Upload ${filename}`,
//       content: content // base64 encoded
//     })
//   });

//   const data = await response.json();

//   if (response.ok) {
//     res.status(200).json({ message: 'File uploaded successfully', data });
//   } else {
//     res.status(response.status).json({ error: data });
//   }
// }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { filename, content } = req.body;

  // Optional: Add folders by date
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const folderPath = `uploads/${year}/${month}`;
  const fullPath = `${folderPath}/${filename}`;

  const githubResponse = await fetch(`https://api.github.com/repos/netizens-vruti/agt/contents/${fullPath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload ${filename}`,
      content: content, // base64 encoded content
    }),
  });

  const data = await githubResponse.json();

  if (githubResponse.ok) {
    return res.status(200).json({
      message: 'File uploaded successfully',
      download_url: data.content.download_url,
    });
  } else {
    return res.status(githubResponse.status).json({
      error: data,
    });
  }
}
