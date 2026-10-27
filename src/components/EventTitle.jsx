import {eventTitle} from '../utils/eventTitle.js';
export default function EventTitle({title}) {
 const text=eventTitle(title);
 const match=text.match(/^(.*?)(\d+(?:\s*-\s*#\d+)?)(.*)$/);
 return match?<>{match[1]}<span className="numbering-title-id">{match[2]}</span>{match[3]}</>:<span className="numbering-title-id">{text}</span>;
}
