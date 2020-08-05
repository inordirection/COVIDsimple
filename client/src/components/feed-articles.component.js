import React, {useState} from 'react';
import { Table, Button, Badge }  from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';

import PaginationTool from './table-pagination.component';
import RatingDropDownButton from './rating.component';
import Preview from './article-preview.component';

import '../App.css';


const FeedTable = ({ articles }) => {
    const [currentPage, setPage] = useState(0);
    const pageSize=20;
    const pageCount = Math.ceil((articles.length) / pageSize);

    return(
        <div>
        <Table id='latest-news' name='latest-news' borderless responsive>
            <thead>
            </thead>
            <tbody>
            {(articles.length > 0) ? articles
                .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                .map( (article, i) => {
                   return (
                    <tr key={ i }>
                        <td ><span className="name">{ReactHtmlParser(article.name)}</span> <Badge color="dark">{ article.date.slice(0,10) }</Badge></td>
                        <td ><Button className='read-latest' size='sm' onClick={() => window.open(`${article.url}`, "_blank")}>Read</Button></td>
                        <td><RatingDropDownButton
                            handleItemClick={async (e, rating) => {
                                let url = ('../api/articles/add');
                                let to_send = article;
                                to_send.rating = rating;
                                let options = {
                                    method: 'POST',
                                    body: JSON.stringify(to_send),
                                    headers: { 'Content-Type': 'application/json' }
                                }
                                try {
                                    let response = await fetch(url, options);
                                    let data = await response.json();
                                    console.log(data);
                                }catch(error){
                                    console.log(error);
                                }
                            }}/>
                        </td>
                        <td ><Preview content={ ReactHtmlParser(article.content) } name={ ReactHtmlParser(article.name) } /></td>
                    </tr>
                   )
               }) : <tr><td colSpan="5">Loading Data...</td></tr>}
                         
            </tbody>
            </Table>
            <PaginationTool aria-label='latest-news-pagintation' pageCount={pageCount} 
            currentPage={currentPage} 
            handlePageClick={(e, index) => {
                e.preventDefault();
                setPage(index);
            }
                
            }
            handleNextClick={() => {
                if(currentPage < pageCount){
                    setPage(currentPage + 1);
                }
            }} 
            handlePrevClick={() => {
                if(currentPage > 0){
                    setPage(currentPage - 1);
                }
            }}/>
            </div>
                
    );
}

export default FeedTable;
