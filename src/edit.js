import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect, getEntityRecord } from '@wordpress/data';
import './editor.scss';

export default function Edit() {
	const { postId, postType, parentId } = useSelect( select => {
    const {
        getCurrentPostId,
        getCurrentPostType,
        getCurrentPostAttribute,
    } = select( 'core/editor' );

    return {
        postId: getCurrentPostId(),
        postType: getCurrentPostType(),
        parentId: getCurrentPostAttribute( 'parent' ),
    };
  }, [] );

  const { firstParentId, theParents, isResolved } = useSelect( select => {
    const { getEntityRecord } = select( 'core' );

    const theParents = [];
    // this is true if the current post has no parent, or that we've found the
    // top ancestor
    let isResolved   = ( ! parentId );

    const findFirstParentId = ( id, type ) => {
        const post = getEntityRecord( 'postType', type, id );

        // If the request has been resolved and the post data is good, then
        // we add the post to the parent pages array. Each item contains the
        // post ID and title. I.e. array( <ID>, <Title> )
        post && theParents.push( [ post.id, post.title?.rendered ] );

        // If the post is a child post, i.e. it has a parent, fetch the parent
        // post. So we're making a recursive function call until the very first
        // parent is found.
        if ( post && undefined !== post.parent && post.parent > 0 ) {
            return findFirstParentId( post.parent, type );
        }

        isResolved = ( !! post );

        // If we've found the top ancestor, return its ID.
        return post ? post.id : -1;
    };

    return {
        firstParentId: parentId ? findFirstParentId( postId, postType ) : -1,
        theParents: theParents.reverse(),
        isResolved,
    };
  }, [ postId, postType, parentId ] );

  return (
    <div { ...useBlockProps() }>
        { ! isResolved && ( <p>Loading..</p> ) }
        { isResolved && theParents.length ? (
            <nav className='breadcrumbs'>
              <a>Home</a>
              { theParents.map( ( [ id, title ] ) => (
                  <a 
                    key={ 'page-' + id }
                  >
                    { title }
                  </a>
              ) ) }
            </nav>
        ) : <p>This post has no parent</p> }
    </div>
  );
}
