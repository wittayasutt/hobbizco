import styled, { css } from 'styled-components'

const DividerStyled = styled.hr`
  background-color: var(--color-primary-blue);
  height: 2px;
  position: absolute;
  width: 100%;
  border: none;
  margin: auto;
  left: 0;
  ${(props) => props.isTop && 'top: 0'};
  ${(props) => props.isRight && 'right: 0; left: unset'};
  ${(props) => props.isLeft && 'left: 0'};
  ${(props) => props.isBottom && 'bottom: 0'};
  ${(props) =>
    props.isMarginRight &&
    css`
      width: calc(100% - 15px);
      left: 0;
    `};
  ${(props) =>
    props.isMarginVertical &&
    css`
      width: calc(100% - 30px);
      left: 0;
      right: 0;
    `};
  ${(props) =>
    props.isMarginLeft &&
    css`
      width: calc(100% - 15px);
      right: 0;
    `};
`

export default DividerStyled

DividerStyled.defaultProps = {
  isTop: false,
  isBottom: false,
  isMarginRight: false,
  isMarginLeft: false,
  isRight: false,
  isLeft: false,
  isMarginVertical: false,
}
