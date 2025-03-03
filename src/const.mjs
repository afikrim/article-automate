export const FIRST_PROMPT = `
Take my draft article and help me improve it while maintaining my writing style. My style is clear, concise, and fact-based, avoiding unnecessary complexity while maintaining depth.  

Tasks:  
1. Enhance Clarity & Flow – Improve readability, ensure logical progression, and make transitions smoother.  
2. Fact-Checking & References – Verify all claims, ensuring accuracy and credibility. Add references to reliable sources (official reports, academic papers, trusted industry websites) where necessary. If something is uncertain, flag it rather than assuming accuracy.  
3. Refine Grammar & Style – Fix grammar, sentence structure, and awkward phrasing while keeping my tone and voice intact.  
4. Strengthen Arguments – Identify weak points or vague explanations and suggest ways to make them more compelling and well-supported.  
5. Optimize Formatting – Ensure proper use of headings, bullet points, and structure for readability.  
6. Reference Formatting – Format citations in a clear and consistent manner (e.g., inline citations, footnotes, or a reference list at the end).  

Output Format:  
- Do NOT include an introduction or outro-just return the improved article.  
- Do NOT use canvas—respond directly in plain text.  
- Wrap the response in html &lt;content&gt;&lt;/content&gt; tag. The tag should be above and below the response.  

Do not add unnecessary content or change my core message—focus on refining what’s already there. If something needs clarification, suggest edits instead of making assumptions.  
`;

export const SECOND_PROMPT = `
Take the improved draft article and finalize it for publication. Ensure it aligns with my writing style: clear, concise, fact-based, and well-structured.  

Tasks:  
1. Final Fact-Checking & Reference Validation – Double-check all references to ensure they are from credible sources (official reports, academic papers, reputable websites). Remove or flag unreliable sources.  
2. Clarity & Flow – Improve readability, making sure each section transitions smoothly and logically.  
3. Grammar & Style Refinement – Fix grammatical errors, awkward phrasing, and inconsistencies while preserving the original tone.  
4. Formatting & Readability – Use appropriate headings, bullet points, and spacing for better readability. Ensure the introduction grabs attention and the conclusion provides clear takeaways.  
5. Reference Formatting & Consistency – Ensure all citations are properly formatted in a clear and consistent manner. Remove duplicate or unnecessary references.  
6. Final Polish – Ensure the article is typo-free, well-structured, and ready for publication.  

Output Format:  
- Do NOT include an introduction or outro-just return the improved article.  
- Do NOT use canvas—respond directly in plain text.  
- Wrap the response in html &lt;content&gt;&lt;/content&gt; tag. The tag should be above and below the response.  

Do not introduce new information unless necessary for clarity. Focus on refining and validating rather than rewriting. The final version should be professional, engaging, and publication-ready.  
`;
