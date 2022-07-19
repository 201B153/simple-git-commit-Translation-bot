/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info('Yay, the app was loaded -Hello 153');

  app.on('issue_comment.created', async (context) => {
    const body = context.payload.comment.body;
    console.log(body);
    const translatedResponse = await translate(body, 'hi')
    const translated = translatedResponse[0]
    console.log(translated)

    const newBody = body + `\n\n---\n\n` + translated
    console.log(newBody)
    const { owner, repo } = context.repo()
    await context.github.issues.updateComment({
      comment_id: context.payload.comment.id,
      body: newBody,
      owner,
      repo
    })
  });
  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({
      body: 'Thanks for opening this issue!',
    });
    return context.octokit.issues.createComment(issueComment);
  });

};

const {Translate} = require('@google-cloud/translate').v2;
async function translate (body, language) {
  // google API key for language translation
  const key = '_'
  const translator = new translate({ key })
  return translator.translate(body, language)
}
